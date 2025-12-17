import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import submittedGif from "../assets/Submitted.gif";
import uploadImg from "../assets/upload.png";
import usePostAd from "../features/ad/usePostAd";
import useCategories from "../features/categories/useCategories";
import useLocations from "../features/locations/useLocations";
import { usePatchProduct, useProduct } from "../features/products/useProducts";
import normalizePossibleFeatureValues from "../hooks/normalizearrayfeatures";
import useLocationSelection from "../hooks/useLocationSelection";
import {
  createPossibleFeatureValue,
  getFeature,
  getFeatures,
  getPossibleFeatureValues,
} from "../services/featureService";
import { createProductImage } from "../services/productImageService";
import {
  getSubcategories,
  getSubcategory,
} from "../services/subcategoryService";
import type { LocationPayload, Region } from "../types/Location";
import DropdownPopup, { type DropdownPopupHandle } from "./DropDownPopup";

// Module-level cache to persist possible-values requests across component
// mounts. This prevents duplicate network calls when React StrictMode mounts
// components twice during development or when the component unmounts/remounts.
const possibleValuesGlobalCache = new Map<
  number,
  string[] | Promise<string[]>
>();

async function fetchPossibleValuesDedup(featureId: number) {
  const cache = possibleValuesGlobalCache;
  if (cache.has(featureId)) {
    const v = cache.get(featureId)!;
    if (v instanceof Promise) return v;
    return Promise.resolve(v as string[]);
  }

  const p = (async () => {
    try {
      const raw = await getPossibleFeatureValues({ feature: featureId });
      const normalized = normalizePossibleFeatureValues(raw, featureId);
      cache.set(featureId, normalized);
      return normalized;
    } catch (e) {
      cache.delete(featureId);
      throw e;
    }
  })();

  cache.set(featureId, p);
  return p;
}

interface UploadedImage {
  id: number;
  url: string;
  file?: File;
  hasFile?: boolean;
}

interface PostAdFormProps {
  editId?: string | null;
  onClose?: () => void;
  embedded?: boolean;
  mobileBackRef?: React.MutableRefObject<(() => void) | null>;
}

export default function PostAdForm({
  editId: propEditId,
  onClose,
  embedded = false,
  mobileBackRef,
}: PostAdFormProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileStep, setMobileStep] = useState("images");
  const categoryDropdownRef = useRef<DropdownPopupHandle>(null);

  // Set up mobile back button handler
  useEffect(() => {
    if (mobileBackRef) {
      mobileBackRef.current = () => {
        if (mobileStep === "form") {
          setMobileStep("images");
        }
      };
    }
  }, [mobileStep, mobileBackRef]);

  // Handle responsive resize for mobile layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [category, setCategory] = useState("Select Product Category");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<number | "">("");
  const [subcategories, setSubcategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const { categories: fetchedCategories = [], loading: categoriesLoading } =
    useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState<"Sale" | "Pay Later" | "Rent">("Sale");
  const [duration] = useState<string>("Duration (days)");
  const [showSuccess, setShowSuccess] = useState(false);

  const [price, setPrice] = useState<number | "">("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>(["", ""]);
  // attachedFeatures: list of selections where user picks an existing feature and provides a value
  const [attachedFeatures] = useState<
    Array<{ feature?: number; value: string }>
  >([{ feature: undefined, value: "" }]);
  // creation of catalog features is disabled for regular users; we only fetch existing definitions
  const [featureDefinitions, setFeatureDefinitions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [featureDefsLoading, setFeatureDefsLoading] = useState(false);
  const [featureValues, setFeatureValues] = useState<Record<number, string>>(
    {},
  );
  const [possibleFeatureValues, setPossibleFeatureValues] = useState<
    Record<number, string[]>
  >({});

  const getCategoryIcon = (categoryName: string) => {
    const cleanName = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return `/${cleanName}.png`;
  };

  // Fetch subcategories whenever categoryId changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (mounted) setSubcategoriesLoading(true);
        if (typeof categoryId === "number" && !isNaN(categoryId)) {
          let subs = (await getSubcategories({ category: categoryId })) as any;
          if (!mounted) return;
          // DEV: inspect raw response to help debug why subcategories might be empty
          if (import.meta.env.DEV) {
            try {
              console.debug(
                "Raw subcategories response for category",
                categoryId,
                subs,
              );
            } catch {
              void 0;
            }
          }
          // Some APIs return { results: [...] } while others return an array directly.
          if (!Array.isArray(subs) && subs && Array.isArray(subs.results))
            subs = subs.results;
          const mapped = (subs || []).map((s: any) => ({
            id: s.id,
            name: s.name ?? s.title ?? s.display_name ?? s.label ?? "",
          }));
          if (import.meta.env.DEV) {
            try {
              console.debug("Mapped subcategories:", mapped);
            } catch {
              void 0;
            }
          }
          setSubcategories(mapped);
        } else {
          setSubcategories([]);
        }
      } catch (e) {
        console.warn("Failed to fetch subcategories", e);
        setSubcategories([]);
      } finally {
        if (mounted) setSubcategoriesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [categoryId]);

  // Fetch feature definitions when a subcategory is selected
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setFeatureDefsLoading(true);
        if (typeof subcategoryId === "number" && !isNaN(subcategoryId)) {
          if (import.meta.env.DEV)
            console.debug(
              "Fetching feature definitions for subcategory:",
              subcategoryId,
            );
          let features = (await getFeatures({
            subcategory: subcategoryId,
          })) as any;
          if (!mounted) return;
          // Some backends return { results: [...] }
          if (
            !Array.isArray(features) &&
            features &&
            Array.isArray(features.results)
          )
            features = features.results;
          // map to minimal definition shape used by this component
          const defs = (features || []).map((f: any) => ({
            id: Number(f.id),
            name: String(f.name ?? f.display_name ?? f.title ?? ""),
          }));
          if (import.meta.env.DEV)
            console.debug("Fetched feature definitions:", defs);
          setFeatureDefinitions(defs);
        } else {
          setFeatureDefinitions([]);
        }
      } catch (e) {
        console.warn("Failed to fetch feature definitions for subcategory", e);
        if (mounted) setFeatureDefinitions([]);
      } finally {
        if (mounted) setFeatureDefsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [subcategoryId]);

  // Fetch possible values for feature definitions when they change
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (import.meta.env.DEV) {
          try {
            console.debug(
              "Attempting to fetch possible feature values for featureDefinitions:",
              featureDefinitions.map((f) => f.id),
            );
          } catch (e) {
            void e;
          }
        }

        const perFeaturePromises = (featureDefinitions || []).map((fd) =>
          fetchPossibleValuesDedup(fd.id)
            .then((res) => ({ fid: fd.id, res }))
            .catch((err) => {
              if (import.meta.env.DEV)
                console.debug(`Failed fetch for feature ${fd.id}`, err);
              return { fid: fd.id, res: null };
            }),
        );

        if (perFeaturePromises.length === 0) {
          if (import.meta.env.DEV)
            console.debug(
              "No feature definitions to fetch possible values for.",
            );
          if (mounted) setPossibleFeatureValues({});
          return;
        }

        const perFeatureResults = await Promise.all(perFeaturePromises);

        if (import.meta.env.DEV) {
          try {
            console.debug("Raw possible-values responses:", perFeatureResults);
          } catch (e) {
            void e;
          }
        }

        const normalized: Record<number, string[]> = {};
        perFeatureResults.forEach(({ fid, res }) => {
          const values = normalizePossibleFeatureValues(res, fid);
          if (values.length > 0) normalized[fid] = values;
        });

        if (import.meta.env.DEV) {
          try {
            console.debug(
              "Normalized possibleFeatureValues to be set:",
              normalized,
            );
          } catch (e) {
            void e;
          }
        }

        if (mounted) setPossibleFeatureValues(normalized);
      } catch (e) {
        console.warn("Failed to fetch possible feature values", e);
        if (mounted) setPossibleFeatureValues({});
      }
    })();

    return () => {
      mounted = false;
    };
  }, [featureDefinitions]);

  // DEV: log feature definitions when they change so UI debugging is easier
  useEffect(() => {
    if (import.meta.env.DEV) {
      try {
        console.debug("featureDefinitions updated:", featureDefinitions);
      } catch (e) {
        void e;
      }
    }
  }, [featureDefinitions]);

  // DEV: log possibleFeatureValues when it actually changes (state updates are async)
  useEffect(() => {
    if (import.meta.env.DEV) {
      try {
        console.debug("possibleFeatureValues updated:", possibleFeatureValues);
      } catch (e) {
        void e;
      }
    }
  }, [possibleFeatureValues]);

  // Ensure possible values are fetched when an attached feature is selected
  useEffect(() => {
    let mounted = true;

    (async () => {
      const toFetch = attachedFeatures
        .map((a) => a.feature)
        .filter(
          (f): f is number =>
            typeof f === "number" && !(f in possibleFeatureValues),
        );

      if (import.meta.env.DEV) {
        try {
          console.debug("attachedFeatures triggered; toFetch:", toFetch);
        } catch (e) {
          void e;
        }
      }

      if (toFetch.length === 0) {
        if (import.meta.env.DEV)
          console.debug(
            "No attached features require fetching possible values.",
          );
        return;
      }

      const responses = await Promise.all(
        toFetch.map((fid) =>
          fetchPossibleValuesDedup(fid)
            .then((res) => ({ fid, res }))
            .catch((err) => {
              if (import.meta.env.DEV)
                console.debug(`Failed fetch for attached feature ${fid}`, err);
              return { fid, res: null };
            }),
        ),
      );

      if (import.meta.env.DEV) {
        try {
          console.debug("Responses for attached feature fetches:", responses);
        } catch (e) {
          void e;
        }
      }

      if (!mounted) return;

      const next = { ...possibleFeatureValues };

      responses.forEach(({ fid, res }) => {
        const values = normalizePossibleFeatureValues(res, fid);
        if (values.length) next[fid] = values;
      });

      if (import.meta.env.DEV) {
        try {
          console.debug(
            "PossibleFeatureValues after merging attached responses:",
            next,
          );
        } catch (e) {
          void e;
        }
      }

      setPossibleFeatureValues(next);
    })();

    return () => {
      mounted = false;
    };
  }, [attachedFeatures, possibleFeatureValues]);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const {
    locations: allLocations = [],
    groupedLocations = {},
    loading: locationsLoading,
  } = useLocations();

  // use our centralised hook to manage location selection and saved locations
  const {
    regionLabel,
    locationDetails,
    savedLocations,
    showSaveLocationModal: showSaveModal,
    newLocationName,
    setNewLocationName,
    selectPlace,
    applySavedLocation,
    saveCurrentLocation,
    setShowSaveLocationModal,
    reset: resetLocationSelection,
  } = useLocationSelection(groupedLocations);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Mutation hook for posting ads
  const postAdMutation = usePostAd();
  const [searchParams] = useSearchParams();
  const editIdFromUrl = searchParams.get("edit");
  const effectiveEditId = propEditId ?? editIdFromUrl;
  const { data: existingProduct } = useProduct(effectiveEditId ?? "");
  const patchMutation = usePatchProduct();

  // Prefill form when editing an existing product (robust handling)
  useEffect(() => {
    if (!existingProduct) return;

    if (import.meta.env.DEV) {
      try {
        console.debug("[Edit Prefill] existingProduct:", existingProduct);
        console.debug("[Edit Prefill] fetchedCategories:", fetchedCategories);
        console.debug("[Edit Prefill] current subcategories:", subcategories);
        console.debug(
          "[Edit Prefill] groupedLocations keys:",
          Object.keys(groupedLocations || {}),
        );
      } catch (e) {
        void e;
      }
    }

    try {
      setTitle(existingProduct.name ?? "");
      setDescription(
        (existingProduct as any).description ??
        (existingProduct as any).desc ??
        "",
      );
      setPrice(
        typeof existingProduct.price === "number"
          ? existingProduct.price
          : Number(existingProduct.price ?? "") || "",
      );

      // category: accept object or id
      try {
        const prodCatRaw = (existingProduct as any).category ?? null;
        let prodCatId = null as number | null;
        if (prodCatRaw != null) {
          if (typeof prodCatRaw === "object" && prodCatRaw !== null) {
            prodCatId = Number(prodCatRaw.id ?? prodCatRaw.value ?? null);
          } else {
            prodCatId = Number(prodCatRaw);
          }
        }
        if (prodCatId && !isNaN(prodCatId)) {
          const cat = fetchedCategories.find(
            (c) => Number(c.id) === Number(prodCatId),
          );
          if (cat) {
            setCategory(cat.name);
            setCategoryId(Number(cat.id));
          } else {
            setCategoryId(prodCatId);
          }
        }
      } catch {
        void 0;
      }

      // subcategory: handle multiple shapes/keys
      try {
        const prodSubRaw =
          (existingProduct as any).subcategory ??
          (existingProduct as any).subcategory_id ??
          (existingProduct as any).sub_category ??
          (existingProduct as any).subCategory ??
          null;
        if (prodSubRaw != null) {
          if (
            typeof prodSubRaw === "object" &&
            prodSubRaw !== null &&
            typeof prodSubRaw.id !== "undefined"
          ) {
            setSubcategoryId(Number(prodSubRaw.id));
          } else if (!isNaN(Number(prodSubRaw))) {
            setSubcategoryId(Number(prodSubRaw));
          } else {
            // try to match by name later when subcategories loaded
            // store on a temporary attribute via closure (handled in next effect)
          }
        }
      } catch {
        void 0;
      }

      // type -> purpose mapping
      if (existingProduct.type === "SALE") setPurpose("Sale");
      else if (existingProduct.type === "RENT") setPurpose("Rent");
      else setPurpose("Pay Later");

      // images
      const imgs = Array.isArray((existingProduct as any).images)
        ? (existingProduct as any).images
        : [];
      const mapped: UploadedImage[] = imgs.map((im: any, i: number) => ({
        id: i + 1,
        url:
          (im && (im.url || im.image || im.src || im.path)) || String(im || ""),
        file: undefined,
        hasFile: false,
      }));

      // Include top-level image if present and not duplicated
      try {
        const topImage = (existingProduct as any).image;
        if (topImage && typeof topImage === "string") {
          const normalizedTop = String(topImage).trim();
          const already = mapped.find(
            (m: UploadedImage) => String(m.url).trim() === normalizedTop,
          );
          if (!already)
            mapped.unshift({
              id: mapped.length + 1,
              url: normalizedTop,
              file: undefined,
              hasFile: false,
            });
        }
      } catch {
        void 0;
      }

      if (mapped.length > 0) setUploadedImages(mapped);

      // product features
      try {
        const pfs = Array.isArray((existingProduct as any).product_features)
          ? (existingProduct as any).product_features
          : [];
        if (pfs.length > 0) {
          const fv: Record<number, string> = {};
          pfs.forEach((pf: any) => {
            if (!pf) return;
            let fid = NaN;
            if (typeof pf.feature === "number") fid = Number(pf.feature);
            else if (
              pf.feature &&
              typeof pf.feature === "object" &&
              (pf.feature.id || pf.feature_id)
            )
              fid = Number(
                pf.feature.id ?? pf.feature.feature_id ?? pf.feature_id,
              );
            else if (
              typeof pf.feature_id === "number" ||
              typeof pf.feature_id === "string"
            )
              fid = Number(pf.feature_id);
            if (!isNaN(fid) && typeof pf.value !== "undefined")
              fv[fid] = String(pf.value ?? "");
          });
          if (Object.keys(fv).length > 0)
            setFeatureValues((prev) => ({ ...prev, ...fv }));

          // If the product already includes product_features with nested feature objects,
          // derive feature definitions from them so we can fetch possible values immediately
          // without waiting for subcategory-based feature discovery.
          try {
            const defs = pfs
              .map((pf: any) => {
                const f = pf && pf.feature ? pf.feature : null;
                if (!f) return null;
                const id = Number(f.id ?? f.feature_id ?? null);
                const name = String(
                  f.name ?? f.display_name ?? f.title ?? f.label ?? "",
                ).trim();
                if (isNaN(id)) return null;
                return { id, name };
              })
              .filter((d: any) => d !== null)
              // de-duplicate by id
              .reduce((acc: any[], cur: any) => {
                if (!acc.find((x) => x.id === cur.id)) acc.push(cur);
                return acc;
              }, [] as any[]);

            if (defs.length > 0) {
              // Merge with any existing definitions (avoid overwriting if already present)
              setFeatureDefinitions((prev) => {
                const merged = [...prev];
                defs.forEach((d: any) => {
                  if (!merged.find((m) => m.id === d.id)) merged.push(d);
                });
                return merged;
              });
            }
            // If we don't already have a subcategory selected, try to infer one
            // from the feature definitions by fetching feature details and
            // reading their linked subcategory. This helps prefill the form
            // when the product includes feature objects but not explicit
            // subcategory/category fields.
            try {
              if (
                (subcategoryId === "" || subcategoryId == null) &&
                defs.length > 0
              ) {
                (async () => {
                  const fids = defs
                    .map((d: any) => Number(d.id))
                    .filter((n: number) => !isNaN(n));
                  if (fids.length > 0) {
                    const details = await Promise.allSettled(
                      fids.map((fid: number) => getFeature(fid)),
                    );
                    for (const r of details) {
                      if (r.status === "fulfilled") {
                        const feat = r.value as any;
                        const possibleSub =
                          feat?.subcategory ??
                          feat?.subcategory_id ??
                          feat?.sub_category ??
                          feat?.category ??
                          null;
                        let subId = null as number | null;
                        if (possibleSub != null) {
                          if (
                            typeof possibleSub === "object" &&
                            possibleSub?.id
                          )
                            subId = Number(possibleSub.id);
                          else if (!isNaN(Number(possibleSub)))
                            subId = Number(possibleSub);
                        }
                        if (subId && !isNaN(subId)) {
                          setSubcategoryId(Number(subId));
                          // fetch subcategory to determine its category and set categoryId
                          try {
                            const sub = await getSubcategory(Number(subId));
                            const catRaw =
                              (sub as any)?.category ??
                              (sub as any)?.category_id ??
                              null;
                            let catId = null as number | null;
                            if (catRaw != null) {
                              if (typeof catRaw === "object" && catRaw?.id)
                                catId = Number(catRaw.id);
                              else if (!isNaN(Number(catRaw)))
                                catId = Number(catRaw);
                            }
                            if (catId && !isNaN(catId)) {
                              setCategoryId(Number(catId));
                              const cat = fetchedCategories.find(
                                (c) => Number(c.id) === Number(catId),
                              );
                              if (cat) setCategory(cat.name);
                            }
                          } catch {
                            void 0;
                          }
                          break;
                        }
                      }
                    }
                  }
                })().catch(() => {
                  /* ignore errors */
                });
              }
            } catch {
              void 0;
            }
          } catch {
            void 0;
          }
        }
      } catch {
        void 0;
      }

      // location
      try {
        const loc =
          (existingProduct as any).location ??
          (existingProduct as any).place ??
          null;
        if (loc) {
          if (typeof loc === "string") {
            // try to parse "Place, Region" or "Region - Place"
            // Instead of calling `selectPlace` (which opens the save modal),
            // parse the string and apply it directly with `applySavedLocation`
            // to avoid blocking inputs during prefill.
            const raw = String(loc || "").trim();
            let place = raw;
            let region = "";
            if (raw.includes(",")) {
              const parts = raw.split(",").map((s) => s.trim());
              if (parts.length >= 2) {
                place = parts[0];
                region = parts.slice(1).join(", ");
              }
            } else if (raw.includes(" - ")) {
              const parts = raw.split(" - ").map((s) => s.trim());
              if (parts.length >= 2) {
                // assume either "Place - Region" or "Region - Place";
                // prefer treating first as place
                place = parts[0];
                region = parts.slice(1).join(" - ");
              }
            }

            if (place) {
              applySavedLocation({
                label: region ? `${place}, ${region}` : place,
                region,
                place,
              });
            }
          } else if (typeof loc === "object") {
            const place = String(
              loc.name || loc.place || loc.title || "",
            ).trim();
            const region = String(
              loc.region || loc.state || loc.area || "",
            ).trim();
            if (place)
              applySavedLocation({
                label: region ? `${place}, ${region}` : place,
                region,
                place,
              });
          }
        }
      } catch {
        void 0;
      }
    } catch (e) {
      void e;
    }
    // Intentionally omit `subcategoryId` to avoid retrigger loops from prefill logic.
    // We include `setShowSaveLocationModal` so we can safely close the save modal
    // when pre-filling a string location without showing the modal to the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    existingProduct,
    fetchedCategories,
    applySavedLocation,
    groupedLocations,
    selectPlace,
    subcategories,
    setShowSaveLocationModal,
  ]);

  // Infer subcategory from feature definitions (run once when defs appear and
  // no subcategory is set). This is split out from the large prefill effect to
  // avoid retriggering the prefill logic when we set `subcategoryId` here —
  // setting that state previously caused the parent effect to re-run and
  // produced repeated network requests for possible feature values.
  const inferredSubcategoryRef = useRef<boolean>(false);
  useEffect(() => {
    if (inferredSubcategoryRef.current) return;
    if (!existingProduct) return;
    if (subcategoryId !== "" && subcategoryId != null) return;
    // if we already have derived feature definitions from the product features,
    // try to infer a subcategory by inspecting each feature's details.
    (async () => {
      try {
        const pfs = Array.isArray((existingProduct as any).product_features)
          ? (existingProduct as any).product_features
          : [];
        const defs = pfs
          .map((pf: any) => {
            const f = pf && pf.feature ? pf.feature : null;
            if (!f) return null;
            const id = Number(f.id ?? f.feature_id ?? null);
            if (isNaN(id)) return null;
            return id;
          })
          .filter((d: any) => d !== null) as number[];

        if (defs.length === 0) return;

        const details = await Promise.allSettled(
          defs.map((fid: number) => getFeature(fid)),
        );

        for (const r of details) {
          if (r.status === "fulfilled") {
            const feat = r.value as any;
            const possibleSub =
              feat?.subcategory ??
              feat?.subcategory_id ??
              feat?.sub_category ??
              feat?.category ??
              null;
            let subId = null as number | null;
            if (possibleSub != null) {
              if (typeof possibleSub === "object" && possibleSub?.id)
                subId = Number(possibleSub.id);
              else if (!isNaN(Number(possibleSub))) subId = Number(possibleSub);
            }
            if (subId && !isNaN(subId)) {
              setSubcategoryId(Number(subId));
              try {
                const sub = await getSubcategory(Number(subId));
                const catRaw =
                  (sub as any)?.category ?? (sub as any)?.category_id ?? null;
                let catId = null as number | null;
                if (catRaw != null) {
                  if (typeof catRaw === "object" && catRaw?.id)
                    catId = Number(catRaw.id);
                  else if (!isNaN(Number(catRaw))) catId = Number(catRaw);
                }
                if (catId && !isNaN(catId)) {
                  setCategoryId(Number(catId));
                  const cat = fetchedCategories.find(
                    (c) => Number(c.id) === Number(catId),
                  );
                  if (cat) setCategory(cat.name);
                }
              } catch {
                void 0;
              }
              inferredSubcategoryRef.current = true;
              break;
            }
          }
        }
      } catch {
        void 0;
      }
    })();
  }, [existingProduct, fetchedCategories, subcategoryId]);

  // Ensure subcategory is applied when subcategories for the selected category are available
  useEffect(() => {
    if (!existingProduct) return;
    const prodSubRaw =
      (existingProduct as any).subcategory ??
      (existingProduct as any).subcategory_id ??
      (existingProduct as any).sub_category ??
      (existingProduct as any).subCategory ??
      null;
    if (!prodSubRaw) return;
    try {
      const candidateId =
        typeof prodSubRaw === "object" &&
          prodSubRaw !== null &&
          typeof prodSubRaw.id !== "undefined"
          ? Number(prodSubRaw.id)
          : Number(prodSubRaw);
      if (
        !isNaN(candidateId) &&
        subcategories.find((s) => Number(s.id) === candidateId)
      ) {
        setSubcategoryId(candidateId);
        return;
      }
      // try matching by name
      const name = String(
        (typeof prodSubRaw === "object"
          ? (prodSubRaw.name ?? prodSubRaw.title ?? "")
          : prodSubRaw) || "",
      ).trim();
      if (name) {
        const matched = subcategories.find(
          (s) => String(s.name).trim().toLowerCase() === name.toLowerCase(),
        );
        if (matched) setSubcategoryId(Number(matched.id));
      }
    } catch {
      void 0;
    }
  }, [subcategories, existingProduct]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setSelectedImage(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file, i) => ({
      id: uploadedImages.length + i + 1,
      url: URL.createObjectURL(file),
      file,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v.includes("-")) return;
    if (v === "") {
      setPrice("");
      return;
    }
    if (!/^[0-9.]*$/.test(v)) return;
    if ((v.match(/\./g) || []).length > 1) return;
    if (v.includes(".")) {
      const [, dec] = v.split(".");
      if (dec.length > 2) return;
    }
    setPrice(v === "" ? "" : Number(v));
  };

  function handleDeleteImage(id: number) {
    const img = uploadedImages.find((x) => x.id === id);
    if (img && img.url && img.file) {
      try {
        URL.revokeObjectURL(img.url);
      } catch {
        console.log(
          "could not 'URL.revokeObjectURL(img.url);', delete image, i think",
        );
      }
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
  }

  // location selection handled by `useLocationSelection` (selectPlace / applySavedLocation)

  // The canonical `locationDetails` is provided by the `useLocationSelection` hook

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required.");
    if (!categoryId) errors.push("Category is required.");
    if (!locationDetails || !locationDetails.place)
      errors.push("Please choose a location.");
    // If duration is not chosen, we'll send a backend-friendly default later.

    if (errors.length > 0) {
      console.warn("Validation errors:", errors);
      toast.error("Please fix: " + errors.join(" "));
      setIsSubmitting(false);
      return;
    }

    // merge explicit feature values from both the fetched definitions map
    // and the user-attached selections into a single array for the API
    const explicitFeatureValues = [
      ...(featureValues && Object.keys(featureValues).length > 0
        ? Object.entries(featureValues)
          .map(([k, v]) => ({ feature: Number(k), value: v }))
          .filter((f) => f.value && String(f.value).trim() !== "")
        : []),
      ...(attachedFeatures && Array.isArray(attachedFeatures)
        ? attachedFeatures
          .filter((a) => a.feature != null && String(a.value).trim() !== "")
          .map((a) => ({
            feature: Number(a.feature),
            value: String(a.value),
          }))
        : []),
    ];

    // Ensure any newly-typed values which are not yet present in the
    // possibleFeatureValues listing exist on the server. This is a
    // best-effort step: we try to create missing possible values before
    // submitting the ad so users don't need to add them manually.
    try {
      const toCreate: Array<{ feature: number; value: string }> = [];
      explicitFeatureValues.forEach((fv) => {
        try {
          const vals = possibleFeatureValues[fv.feature] || [];
          const v = String(fv.value ?? "").trim();
          if (v && !vals.includes(v)) toCreate.push({ feature: fv.feature, value: v });
        } catch {
          /* ignore malformed entries */
        }
      });

      if (toCreate.length > 0) {
        // de-duplicate by feature+value
        const unique = Array.from(
          new Map(toCreate.map((t) => [`${t.feature}::${t.value}`, t])).values(),
        );

        const createPromises = unique.map((t) =>
          createPossibleFeatureValue({
            feature: t.feature,
            value: t.value,
            subcategory: typeof subcategoryId === "number" ? subcategoryId : undefined,
          }).then(
            () => ({ ok: true, t }),
            (err) => ({ ok: false, t, err }),
          ),
        );

        const results = await Promise.all(createPromises);

        // Merge successful creations into local state and cache (best-effort)
        let anyFailures = false;
        results.forEach((r) => {
          if (r.ok) {
            setPossibleFeatureValues((prev) => ({
              ...prev,
              [r.t.feature]: [...(prev[r.t.feature] || []), r.t.value],
            }));
            try {
              const cached = possibleValuesGlobalCache.get(r.t.feature);
              if (Array.isArray(cached)) possibleValuesGlobalCache.set(r.t.feature, [...cached, r.t.value]);
            } catch {
              // ignore cache update errors
            }
          } else {
            anyFailures = true;
            console.warn("Failed to create possible feature value", r.t, (r as any).err);
          }
        });

        if (anyFailures) {
          toast.error("Some suggested feature values couldn't be saved — ad will still be posted.");
        }
      }
    } catch (e) {
      // Non-fatal: log and continue to submit ad
      console.warn("Auto-create possible feature values failed:", e);
    }
    const locationResolution = (function resolveLocation() {
      try {
        if (!locationDetails)
          return {
            location: {
              region: null as Region | null,
              name: "Unknown",
            } as LocationPayload,
          };
        const found = allLocations.find((l: any) => {
          const regionMatch =
            String(l.region || "")
              .trim()
              .toLowerCase() ===
            String(locationDetails.region || "")
              .trim()
              .toLowerCase();
          const placeMatch =
            String(l.name || l.place || "")
              .trim()
              .toLowerCase() ===
            String(locationDetails.place || "")
              .trim()
              .toLowerCase();
          return regionMatch && placeMatch;
        });
        if (
          found &&
          (typeof found.id === "number" || typeof found.id === "string")
        ) {
          // Prefer sending the canonical integer id as `location_id`.
          return { location_id: Number(found.id) };
        }
        // fallback to legacy shape (region + place) so server can handle it
        return {
          location: {
            region: (locationDetails?.region as Region) || null,
            name: locationDetails?.place ?? "Unknown",
          } as LocationPayload,
        };
      } catch (e) {
        return {
          location: {
            region: (locationDetails?.region as Region) || null,
            name: locationDetails?.place ?? "Unknown",
          } as LocationPayload,
        };
      }
    })();

    const metadata = {
      // name: title.trim(),
      // image: uploadedImages[0]?.url || "",
      // type: purpose === "Sale" ? "SALE" : purpose === "Rent" ? "RENT" : "SERVICE",
      // status: "PENDING",
      // location: {
      //   region: LocationDetails?.region as Region || null,
      //   name: LocationDetails?.place || "Unknown",
      // },
      // price: price !== "" ? Number(price) : 0,
      // duration: null,
      // category: Number(categoryId ?? ""),

      title: title.trim(),
      description: description.trim(),
      category: String(categoryId ?? ""),
      purpose,
      // If the user didn't pick a duration, send a safe default of "0"
      duration:
        duration && duration !== "Duration (days)" ? String(duration) : "0",
      // Provide `pricing` shape so `createProductFromAd` can read duration/value
      pricing: {
        monthly: {
          duration:
            duration && duration !== "Duration (days)" ? String(duration) : "0",
          value: price !== "" ? Number(price) : 0,
        },
      },
      // Prefer to submit the canonical `location` id when available.
      // Try to resolve the selected place+region back to the known locations list.
      ...locationResolution,
      images: uploadedImages.map((img) => ({
        id: img.id,
        url: img.url,
        hasFile: !!img.file,
        // include file object for upload handling (will be stripped/handled server-side)
        file: img.file ?? null,
      })),
      createdAt: new Date().toISOString(),
      ...(price !== "" ? { price } : {}),
      ...(subcategoryId !== "" && subcategoryId != null
        ? { subcategory: String(subcategoryId) }
        : {}),
      // include keyFeatures if user added any (filter out empty strings)
      ...(keyFeatures &&
        Array.isArray(keyFeatures) &&
        keyFeatures.filter((k) => k.trim() !== "").length > 0
        ? { keyFeatures: keyFeatures.filter((k) => k.trim() !== "") }
        : {}),
      // include merged explicit feature values (from fetched defs and user attachments)
      ...(explicitFeatureValues.length > 0
        ? { featureValues: explicitFeatureValues }
        : {}),
    } as any;

    console.log("Ad metadata (JSON):", metadata);

    // Debug: log uploadedImages details to help diagnose missing files
    if (import.meta.env.DEV) {
      try {
        console.debug(
          "Uploaded images summary:",
          uploadedImages.map((u) => ({
            id: u.id,
            hasFile: !!u.file,
            fileName: u.file ? (u.file as File).name : null,
            fileType: u.file ? (u.file as File).type : null,
            url: u.url,
          })),
        );
      } catch (e) {
        void e;
      }
    }

    console.log("Location Details:", locationDetails);
    console.log("Ad Metadata to submit:", metadata);

    try {
      if (effectiveEditId) {
        // Patch existing product (partial update)
        const patchBody: Partial<any> = {
          name: metadata.title,
          description: metadata.description,
          price: metadata.price ?? metadata.pricing?.monthly?.value ?? 0,
          category: Number(metadata.category) || undefined,
          duration: metadata.duration ?? undefined,
          type:
            purpose === "Sale"
              ? "SALE"
              : purpose === "Rent"
                ? "RENT"
                : "PAY LATER",
          // Include location/location_id from the resolved location
          ...locationResolution,
        };

        // Check if we have actual File objects to upload
        const newFiles = uploadedImages.filter(
          (img) => img.file instanceof File,
        );

        // First, update the product metadata
        const result = await patchMutation.mutateAsync({
          id: effectiveEditId,
          body: patchBody,
        });

        // Then, upload any new images to the productImages endpoint
        if (newFiles.length > 0) {
          const imageUploadPromises = newFiles.map(async (img) => {
            const formData = new FormData();
            formData.append("image", img.file as File);
            formData.append("product", String(effectiveEditId));

            return createProductImage(formData as any);
          });

          await Promise.all(imageUploadPromises);
        }

        toast.success("Ad updated successfully");
        console.log("Patch response:", result);
        setShowSuccess(true);
        if (embedded && typeof onClose === "function") {
          // close after small delay so the success toast is visible
          setTimeout(() => onClose(), 700);
        }
      } else {
        // pass the metadata including file objects (mutation handler will detect files)
        const result = await postAdMutation.mutateAsync(metadata as any);
        console.log("Server response:", result);
        const serverMessage = (result as { message?: string })?.message;
        toast.success(serverMessage ?? "Ad saved successfully!");
        setShowSuccess(true);
        if (embedded && typeof onClose === "function") {
          setTimeout(() => onClose(), 700);
        }
      }
    } catch (err: unknown) {
      console.error("Upload failed:", err);

      // Try to extract a helpful server-side error message (e.g. { detail: '...' })
      let friendly = "An error occurred while saving.";

      try {
        const raw = err instanceof Error ? err.message : String(err);

        // Look for a JSON object in the error text and parse it
        const jsonMatch = raw.match(/(\{[\s\S]*\})$/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed && typeof parsed === "object") {
              if (typeof parsed.detail === "string") friendly = parsed.detail;
              else if (typeof parsed.message === "string")
                friendly = parsed.message;
            }
          } catch (e) {
            // not JSON — ignore
            void e;
          }
        } else {
          // fallback: if message contains a JSON-like substring elsewhere, try to find it
          const curly = raw.match(/(\{[\s\S]*\})/m);
          if (curly) {
            try {
              const parsed = JSON.parse(curly[1]);
              if (parsed && typeof parsed === "object") {
                if (typeof parsed.detail === "string") friendly = parsed.detail;
                else if (typeof parsed.message === "string")
                  friendly = parsed.message;
              }
            } catch (e) {
              void e;
            }
          } else {
            // final fallback: show the entire error text
            if (raw && raw.trim()) friendly = raw;
          }
        }

        if (import.meta.env.DEV)
          console.debug("Parsed server error message:", friendly);
      } catch (e) {
        void e;
      }

      toast.error(friendly);
    } finally {
      setIsSubmitting(false);
    }
  }

  const reorder = (
    list: UploadedImage[],
    startIndex: number,
    endIndex: number,
  ): UploadedImage[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Select Product Category");
    setCategoryId(null);
    setSubcategoryId("");
    setPurpose("Sale");
    setPrice("");
    resetLocationSelection();
    setUploadedImages([]);
    setKeyFeatures(["", ""]);
    setShowSuccess(false);
    setIsSubmitting(false);
  };

  const SaveBtn = () => (
    <button
      disabled={isSubmitting}
      type="submit"
      className={`w-full lg:w-[80%] bg-gray-100 max-lg:bg-gray-200 max-lg:mt-5 hover:bg-gray-200 text-[var(--dark-def)] rounded-xl py-4 lg:py-7 md:text-[1.25vw] text-center cursor-pointer lg:bg-[var(--div-active)]`}
    >
      {isSubmitting
        ? effectiveEditId
          ? "Updating..."
          : "Saving..."
        : effectiveEditId
          ? "Update"
          : "Save"}
    </button>
  );

  return (
    <form
      className="flex flex-col lg:h-[96vh] max-lg:bg-[var(--div-active)] w-full h-dvh min-h-0 py-2"
      onSubmit={handleSave}
    >
      <div className="text-xs flex lg:items-center lg:flex-row flex-1 min-h-0 w-full gap-6 lg:gap-2 py-3 lg:pr-2 lg:overflow-y-hidden">
        {(!isMobile || mobileStep === "form") && (
          <div className={`flex flex-col w-full lg:h-[93vh] lg:w-3/5 bg-white max-lg:bg-[var(--div)] lg:rounded-xl p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar ${
            isMobile && !embedded ? "bg-[var(--div-active)]" : ""
          }`}>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block mb-1 max-sm:font-medium text-sm md:text-base lg:text-[1vw]">Product Category</label>
                <DropdownPopup
                  ref={categoryDropdownRef}
                  triggerLabel={
                    categoryId
                      ? subcategoryId && subcategories.find((s) => s.id === subcategoryId)
                        ? `${category} - ${subcategories.find((s) => s.id === subcategoryId)!.name}`
                        : `${category} - Select Subcategory`
                      : category
                  }
                  options={fetchedCategories.map((c) => c.name)}
                  subOptions={subcategories.map((s) => s.name)}
                  subLoading={subcategoriesLoading}
                  supportsSubmenu
                  title={categoriesLoading ? "Loading categories..." : "Select Category"}
                  subTitle="Select Subcategory"
                  initialSubView={!!categoryId}
                  useBottomSheetOnMobile
                  getMainOptionIcon={getCategoryIcon}
                  onMainSelect={(opt) => {
                    const match = fetchedCategories.find((c) => c.name === opt);
                    setCategory(opt);
                    setCategoryId(match ? Number(match.id) : null);
                    setSubcategoryId("");
                  }}
                  onSubSelect={(opt) => {
                    const m = subcategories.find((s) => s.name === opt);
                    setSubcategoryId(m ? Number(m.id) : "");
                  }}
                  onSelect={() => {
                    /* handled via onMainSelect/onSubSelect */
                  }}
                />
              </div>

              <div>
                <label className="block mb-1 max-sm:font-medium text-sm md:text-base lg:text-[1vw]">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Add a title"
                  className="w-full text-sm md:text-base max-lg:bg-white lg:text-[1vw] p-3 border rounded-xl border-[var(--div-border)]"
                />
              </div>
              <div>
                <p className="mb-1 text-sm md:text-base max-sm:font-medium lg:text-[1vw]">Price</p>
                <div className="relative">
                  <input
                    value={price}
                    onChange={(e) => handlePriceChange(e)}
                    type="number"
                    placeholder="0.00"
                    className="w-full border max-lg:bg-white text-sm md:text-base lg:text-[1vw] rounded-xl border-(--div-border) p-3 pl-7 lg:pl-[5%]"
                  />
                  <p className="absolute inline top-3.25 text-base md:text-base lg:text-[1vw] left-3">₵</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm md:text-base max-sm:font-medium lg:text-[1vw]">Declare ad purpose?</p>
              <div className="flex gap-3 max-sm:grid max-sm:grid-cols-2 max-sm:gap-7 max-sm:pr-15">
                {(
                  [
                    "Sale",
                    // "Pay Later",
                    "Rent",
                  ] as const
                ).map((option) => (
                  <label
                    key={option}
                    className="relative flex items-center gap-1 md:min-w-[100px] max-lg:shadow-xs max-sm:py-4 text-sm md:text-base lg:text-[0.85vw] max-lg:bg-white hover:bg-gray-100 bg-[var(--div-active)] rounded-lg px-4 py-2 pt-3.5 pr-4 max-md:pr-7 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="purpose"
                      checked={purpose === option}
                      onChange={() => setPurpose(option)}
                      className="absolute top-1 right-0.5 accent-[var(--dark-def)]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {purpose === "Rent" && (
                <p className="text-xs md:text-sm lg:text-[0.75vw] text-gray-600 mt-2 italic">
                  💡 Price will display as "per month" when users view your ad
                </p>
              )}
            </div>

            <div>
              <div>
                <DropdownPopup
                  triggerLabel={regionLabel ?? "Ad Area Location"}
                  options={groupedLocations}
                  onSelect={(opt) => {
                    selectPlace(opt);
                  }}
                  supportsSubmenu
                  title={
                    locationsLoading
                      ? "Loading locations..."
                      : "Select Region"
                  }
                  useBottomSheetOnMobile
                />
              </div>

              <div className="flex flex-wrap gap-2 lg:gap-1 my-1 font-medium">
                {savedLocations.map((loc) => (
                  <button
                    key={`${loc.label}|${loc.place}`}
                    type="button"
                    className="p-1 bg-gray-100  text-xs md:text-sm lg:text-[0.85vw] rounded-xs hover:bg-gray-200"
                    onClick={() => applySavedLocation(loc)}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
             
            </div>

            <div>
              <div className="flex flex-col gap-2">
                {(() => {
                  const hasRenderableFeatures = featureDefinitions.some(
                    (fd) => (possibleFeatureValues[fd.id] ?? []).length > 0,
                  );
                  const shouldShowBlock = featureDefsLoading || hasRenderableFeatures;
                  if (!shouldShowBlock) return null;

                  return (
                  <div className="mt-4">
                    {hasRenderableFeatures && (
                      <label className="block mb-1 font-medium max-sm:font-medium text-sm md:text-base lg:text-[0.85vw]">
                        Features for selected subcategory
                      </label>
                    )}

                    {featureDefsLoading ? (
                      <p className="loading-dots text-sm md:text-base lg:text-[0.85vw]">
                        Loading this subcategory's features
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {featureDefinitions
                          .filter((fd) => (possibleFeatureValues[fd.id] ?? []).length > 0)
                          .map((fd) => {
                            const values = possibleFeatureValues[fd.id] ?? [];
                            return (
                              <div
                                key={`def-${fd.id}`}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1/3 text-sm">{fd.name}</div>
                                <div className="flex-1">
                                  <DropdownPopup
                                    triggerLabel={
                                      featureValues[fd.id]
                                        ? String(featureValues[fd.id])
                                        : `Select ${fd.name}`
                                    }
                                    options={values}
                                    onSelect={(opt) => {
                                      setFeatureValues((prev) => ({
                                        ...prev,
                                        [fd.id]: opt,
                                      }));
                                    }}
                                    title={`Select ${fd.name}`}
                                    useBottomSheetOnMobile
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  );
                })()}
                <div className="mt-4">
                  <label className="block mb-1  text-sm md:text-base lg:text-[1vw]">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product"
                    className="w-full outline-0 max-lg:bg-white p-3 border text-sm md:text-base lg:text-[1vw] rounded-xl border-[var(--div-border)] h-32 resize-none"
                  />
                </div>
              </div>
              {isMobile && (
                <div className=" w-full flex items-center justify-center -ml-4 max-sm:ml-0">
                  <div className="w-full flex flex-col gap-3 items-center justify-center">
                    <SaveBtn />
                  </div>
                </div>
              )}
              <div className="h-24 lg:h-12 w-full" />
            </div>
          </div>
        )}

        {(!isMobile || mobileStep === "images") && (
          <div className="relative flex flex-col lg:h-[93vh] z-0 max-lg:h-[80vh] w-full lg:w-2/5 lg:bg-white rounded-xl p-4 sm:p-6 mt-4 lg:mt-0">
            <div className="w-full">
              <label className="bg-gray-100 lg:bg-transparent border-1 border-dashed rounded-xl flex flex-col items-center justify-center h-25 cursor-pointer hover:bg-gray-50">
                <p className="text-xs text-gray-500 mb-1 md:text-[1.2vw]">
                  Upload Images
                </p>
                <img
                  src={uploadImg}
                  alt="upload"
                  className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw] text-gray-500"
                />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <div className="flex justify-between md:justify-around text-sm scale-60 md:scale-80 -ml-18 text-gray-500 my-1 gap-4 md:gap-4 md:text-[0.85vw] md:pl-8">
                <span className="whitespace-nowrap py-1 px-2 bg-[var(--div-active)] rounded-xl">
                  {uploadedImages.length} images added
                </span>
                <span className="whitespace-nowrap py-1 px-2 bg-[var(--div-active)] rounded-xl">
                  • Drag images to arrange
                </span>
                <span className="whitespace-nowrap py-1 px-2 bg-[var(--div-active)] rounded-xl">
                  • Tap image twice to delete
                </span>
              </div>

              <div className="relative flex flex-col w-full max-h-[70vh]">
                <DragDropContext
                  onDragEnd={(result) => {
                    if (!result.destination) return;
                    const reordered = reorder(
                      uploadedImages,
                      result.source.index,
                      result.destination.index,
                    );
                    setUploadedImages(reordered);
                  }}
                >
                  <Droppable
                    droppableId="imageGrid"
                    direction="horizontal"
                    renderClone={null}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="
                          grid gap-3 sm:gap-4 relative mt-3 overflow-y-auto no-scrollbar
                          grid-cols-2 sm:grid-cols-3
                        "
                      >
                        {uploadedImages.map((img, index) => (
                          <Draggable
                            key={img.id}
                            draggableId={img.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative group flex justify-center items-center"
                              >
                                <img
                                  src={img.url}
                                  alt={`Uploaded ${img.id}`}
                                  className="w-full h-full rounded-lg object-cover cursor-pointer"
                                  onClick={() => setSelectedImage(img.id)}
                                />
                                {selectedImage === img.id && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg z-10">
                                    <button
                                      onClick={() => handleDeleteImage(img.id)}
                                      className="h-full w-full bg-transparent text-red-600 hover:bg-red-200/40 py-2 rounded-xl text-xs font-medium text-center transition-all"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <div className="h-[150px] w-full bg-transparent" />
              </div>
            </div>

            {isMobile && (
              <>
                <div className="w-full flex justify-center items-center lg:hidden px-3">
                  <button
                    onClick={() => {
                      if (uploadedImages.length === 0) {
                        toast.error("Please upload at least one image");
                        return;
                      }
                      setMobileStep("form");
                    }}
                    type="button"
                    className={`fixed bottom-20 sm:bottom-25 w-9/10 py-3.5 max-lg:bg-gray-200 sm:py-7 text-sm rounded-xl transition z-50 cursor-pointer ${
                      uploadedImages.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 text-[var(--dark-def)] hover:bg-gray-200"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {!isMobile && (
              <div className="lg:absolute lg:-ml-5 bottom-4 w-full flex justify-center items-center">
                <SaveBtn />
              </div>
            )}
          </div>
        )}

        {showSuccess && !embedded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white max-sm:h-fit rounded-3xl shadow-xl p-6 sm:p-8 w-[90%] max-w-sm flex flex-col items-center text-center mx-3">
              <div className="max-sm:w-35 max-sm:h-35 w-48 h-48 flex items-center justify-center">
                <img className="max-sm:w-35 max-sm:h-35 " src={submittedGif} alt="Submitted" />
              </div>

              <h2 className="text-2xl font-semibold mt-4 max-sm:mt-0 text-[var(--dark-def)]">
                Submitted!
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-sm:mb-4">
                Your ad has been posted successfully.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    resetForm();
                  }}
                  className="w-full py-3 rounded-xl border-gray-300 hover:bg-gray-100 hover:text-[var(--dark-def)] border cursor-pointer active:scale-98 transition"
                >
                  Post New
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full border border-gray-300 py-3 cursor-pointer rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-gray-100 rounded-3xl shadow-xl pt-6 sm:pt-8 w-[90%] max-w-sm flex flex-col items-center text-center mx-3">
              <h2 className="text-lg px-6 sm:px-8 md:text-xl lg:text-[1.5vw] font-semibold text-[var(--dark-def)] mb-2">
                Would you want to save this location for future use?
              </h2>

              <p className="text-sm md:text-base lg:text-[1vw] px-6 sm:px-8  text-gray-600 mb-4 flex flex-row justify-center place-items-center">
                <svg
                  className="inline"
                  width="10"
                  height="12"
                  viewBox="0 0 6 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 0C2.20467 0.000970362 1.44216 0.351758 0.879752 0.975408C0.317341 1.59906 0.000954678 2.44464 0 3.32666C0 4.18333 0.598136 5.52399 1.77788 7.31132C1.91832 7.5247 2.10221 7.69828 2.31458 7.81796C2.52694 7.93763 2.76179 8 3 8C3.23821 8 3.47305 7.93763 3.68542 7.81796C3.89779 7.69828 4.08168 7.5247 4.22212 7.31132C5.40186 5.52399 6 4.18333 6 3.32666C5.99905 2.44464 5.68266 1.59906 5.12025 0.975408C4.55784 0.351758 3.79533 0.000970362 3 0ZM3 4.65266C2.76221 4.65266 2.52976 4.57446 2.33205 4.42795C2.13433 4.28144 1.98023 4.07321 1.88923 3.82957C1.79824 3.58594 1.77443 3.31785 1.82082 3.05921C1.86721 2.80057 1.98171 2.56299 2.14986 2.37652C2.318 2.19005 2.53223 2.06306 2.76545 2.01162C2.99867 1.96017 3.24041 1.98657 3.46009 2.08749C3.67978 2.18841 3.86755 2.3593 3.99966 2.57857C4.13177 2.79783 4.20228 3.05562 4.20228 3.31933C4.20228 3.67295 4.07561 4.01209 3.85014 4.26214C3.62467 4.51218 3.31887 4.65266 3 4.65266Z"
                    fill="#6B7983"
                  />
                </svg>
                &#160;
                <span>{regionLabel}</span>
              </p>

              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Name this location. Ex: Accra Shop"
                className="w-4/5 text-sm md:text-base lg:text-[1.25vw] placeholder:text-sm placeholder:md:text-base placeholder:lg:text-[1vw] border outline-0 bg-white border-gray-300 rounded-xl px-4 py-5 mb-6 lg:mb-2"
              />
              <div className="w-full h-[1px] bg-gray-300 mt-4" />

              <div className="flex w-full">
                <button
                  onClick={() => {
                    const ok = saveCurrentLocation();
                    if (ok) {
                      toast.success("Saved location locally");
                    } else {
                      toast.error("Could not save location");
                    }
                  }}
                  className="w-full rounded-bl-3xl text-base lg:text-[1.2vw] hover:bg-gray-300 py-5 font-medium cursor-pointer transition"
                  type="button"
                >
                  Save Location
                </button>

                <button
                  onClick={() => {
                    setNewLocationName("");
                    setShowSaveLocationModal(false);
                  }}
                  type="button"
                  className="w-full border-l-2 text-base lg:text-[1.2vw] border-gray-300 py-3 rounded-br-3xl hover:bg-gray-300 py-5 font-medium cursor-pointer  transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
