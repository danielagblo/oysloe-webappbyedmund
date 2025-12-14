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
import DropdownPopup from "./DropDownPopup";

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
}

export default function PostAdForm({
  editId: propEditId,
  onClose,
  embedded = false,
}: PostAdFormProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileStep, setMobileStep] = useState("images");

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
  const [featureValues, setFeatureValues] = useState<Record<number, string>>(
    {},
  );
  const [possibleFeatureValues, setPossibleFeatureValues] = useState<
    Record<number, string[]>
  >({});

  // Fetch subcategories whenever categoryId changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
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
      className={`w-full lg:w-[80%] bg-gray-100 hover:bg-gray-200 text-[var(--dark-def)] rounded-xl py-4 lg:py-7 md:text-[1.25vw] text-center cursor-pointer lg:bg-[var(--div-active)]`}
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
      className="flex flex-col w-full h-dvh min-h-0 py-2"
      onSubmit={handleSave}
    >
      <div className="text-xs flex lg:flex-row flex-1 min-h-0 w-full gap-6 lg:gap-2 py-3 lg:pr-2 lg:overflow-y-hidden">
        {(!isMobile || mobileStep === "form") && (
          <div className="flex flex-col w-full lg:w-3/5 lg:shadow-lg bg-white lg:rounded-xl p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block mb-1">Product Category</label>
                <DropdownPopup
                  triggerLabel={category}
                  supportsSubmenu
                  options={fetchedCategories.map((c) => c.name)}
                  onSelect={(opt) => {
                    const match = fetchedCategories.find((c) => c.name === opt);
                    setCategory(opt);
                    setCategoryId(match ? Number(match.id) : null);
                    console.log(
                      "category chosen:",
                      opt,
                      "id:",
                      match?.id ?? null,
                    );
                  }}
                  title={
                    categoriesLoading
                      ? "Loading categories..."
                      : "Select Category"
                  }
                />
                <div className="mt-2">
                  <label className="block mb-1">Subcategory (optional)</label>
                  <DropdownPopup
                    triggerLabel={
                      subcategoryId &&
                      subcategories.find((s) => s.id === subcategoryId)
                        ? subcategories.find((s) => s.id === subcategoryId)!
                            .name
                        : "Select subcategory"
                    }
                    options={subcategories.map((s) => s.name)}
                    onSelect={(opt) => {
                      const m = subcategories.find((s) => s.name === opt);
                      setSubcategoryId(m ? Number(m.id) : "");
                    }}
                    title={"Select Subcategory"}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Add a title"
                  className="w-full p-3 border rounded-xl border-[var(--div-border)]"
                />
              </div>
              <div>
                <p className="mb-1 font-medium">Price</p>
                <div className="relative">
                  <input
                    value={price}
                    onChange={(e) => handlePriceChange(e)}
                    type="number"
                    placeholder="0.00"
                    className="w-full border rounded-xl border-(--div-border) p-3 pl-7"
                  />
                  <p className="absolute inline top-3.25 left-3">₵</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1">Declare ad purpose?</p>
              <div className="flex gap-3">
                {(
                  [
                    "Sale",
                    // "Pay Later",
                    "Rent",
                  ] as const
                ).map((option) => (
                  <label
                    key={option}
                    className="relative flex items-center gap-1 bg-[var(--div-active)] rounded-lg px-4 py-2 pt-3.5 pr-4 max-md:pr-7 cursor-pointer"
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
                <p className="text-xs text-gray-600 mt-2 italic">
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
                      : "Select Region / Place"
                  }
                />
              </div>

              <div className="flex flex-wrap gap-2 lg:gap-1 my-1 font-medium">
                {savedLocations.map((loc) => (
                  <button
                    key={`${loc.label}|${loc.place}`}
                    type="button"
                    className="p-1 bg-gray-100 rounded-xs text-xs hover:bg-gray-200"
                    onClick={() => applySavedLocation(loc)}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
{/* 
              <p className="text-[8px] text-[var(--bg-active)] mt-1 font-bold">
                <svg
                  className="inline"
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_18425_111"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="12"
                    height="12"
                  >
                    <path d="M12 0H0V12H12V0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_18425_111)">
                    <path
                      d="M6 7.50123C5.8674 7.50123 5.74025 7.44621 5.64645 7.35621C5.5527 7.26121 5.5 7.13623 5.5 7.00123V3.00123C5.5 2.86623 5.5527 2.74125 5.64645 2.64625C5.74025 2.55625 5.8674 2.50123 6 2.50123C6.1326 2.50123 6.2598 2.55625 6.35355 2.64625C6.44735 2.74125 6.5 2.86623 6.5 3.00123V7.00123C6.5 7.13623 6.44735 7.26121 6.35355 7.35621C6.2598 7.44621 6.1326 7.50123 6 7.50123ZM6.3965 11.8812C7.4765 11.4462 11 9.74125 11 6.02125V3.43622C11.0006 2.91122 10.8353 2.4012 10.5277 1.9712C10.2201 1.5462 9.78595 1.23123 9.287 1.06623L6.1575 0.02625C6.05535 -0.00875 5.9447 -0.00875 5.8425 0.02625L2.713 1.06623C2.21405 1.23123 1.7799 1.5462 1.4723 1.9712C1.16475 2.4012 0.999451 2.91122 1 3.43622V6.02125C1 9.30625 4.5025 11.3112 5.5765 11.8462C5.71235 11.9112 5.8542 11.9662 6 12.0012C6.1356 11.9712 6.2683 11.9312 6.3965 11.8812ZM8.972 2.01124C9.2713 2.11124 9.53165 2.30122 9.7162 2.56122C9.90075 2.81622 10.0001 3.12122 10 3.43622V6.02125C10 9.11625 6.9565 10.5762 6.0235 10.9512C5.0795 10.4812 2 8.73125 2 6.02125V3.43622C1.99995 3.12122 2.09925 2.81622 2.2838 2.56122C2.46835 2.30122 2.72875 2.11124 3.028 2.01124L6 1.02625L8.972 2.01124ZM6 8.50123C5.9011 8.50123 5.80445 8.53125 5.72225 8.58625C5.64 8.64125 5.5759 8.71622 5.53805 8.81122C5.50025 8.90122 5.49035 9.0012 5.5096 9.1012C5.5289 9.1962 5.57655 9.28621 5.64645 9.35621C5.7164 9.42621 5.8055 9.47122 5.90245 9.49122C5.99945 9.51122 6.1 9.50125 6.19135 9.46125C6.2827 9.42625 6.3608 9.36126 6.41575 9.28126C6.4707 9.19626 6.5 9.10123 6.5 9.00123C6.5 8.86623 6.44735 8.74125 6.35355 8.64625C6.2598 8.55625 6.1326 8.50123 6 8.50123Z"
                      fill="#374957"
                    />
                  </g>
                </svg>
                &nbsp; This is required only for verification and safety purpose
              </p> */}
            </div>

            <div>
              <div className="flex flex-col gap-2">
                {featureDefinitions.length > 0 && (
                  <div className="mt-4">
                    <label className="block mb-1 font-medium">
                      Features for selected subcategory
                    </label>

                    <div className="flex flex-col gap-2">
                      {featureDefinitions.map((fd) => {
                        const values = possibleFeatureValues[fd.id] ?? [];
                        return (
                          <div
                            key={`def-${fd.id}`}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1/3 text-sm">{fd.name}</div>
                            {values && values.length > 0 ? (
                              <div className="flex-1">
                                <input
                                  list={`feature-values-${fd.id}`}
                                  placeholder={`Select or type ${fd.name}`}
                                  value={featureValues[fd.id] ?? ""}
                                  onChange={(e) =>
                                    setFeatureValues((prev) => ({
                                      ...prev,
                                      [fd.id]: e.target.value,
                                    }))
                                  }
                                  className="w-full p-3 border rounded-xl border-[var(--div-border)]"
                                />
                                <datalist id={`feature-values-${fd.id}`}>
                                  {values.map((v) => (
                                    <option key={v} value={v} />
                                  ))}
                                </datalist>
                              </div>
                            ) : (
                              <input
                                type="text"
                                placeholder={`Value for ${fd.name}`}
                                value={featureValues[fd.id] ?? ""}
                                onChange={(e) =>
                                  setFeatureValues((prev) => ({
                                    ...prev,
                                    [fd.id]: e.target.value,
                                  }))
                                }
                                className="flex-1 p-3 border rounded-xl border-[var(--div-border)]"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product"
                    className="w-full p-3 border rounded-xl border-[var(--div-border)] h-32 resize-none"
                  />
                </div>
              </div>
              {isMobile && (
                <div className=" w-full flex items-center justify-center -ml-4 max-sm:ml-0">
                  <div className="w-full flex flex-col gap-3 items-center justify-center">
                    <button
                      onClick={() => setMobileStep("images")}
                      type="button"
                      className="flex items-center justify-center mt-4 border w-full border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-100 transition"
                    >
                      <img src="/arrowleft.svg" alt="<" loading="eager" />
                      <span>Back to Images</span>
                    </button>
                    <SaveBtn />
                  </div>
                </div>
              )}
              <div className="h-24 lg:h-12 w-full" />
            </div>
          </div>
        )}

        {(!isMobile || mobileStep === "images") && (
          <div className="relative flex flex-col w-full lg:w-2/5 lg:bg-white lg:shadow-lg rounded-xl p-4 sm:p-6 mt-4 lg:mt-0">
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
                    onClick={() => setMobileStep("form")}
                    type="button"
                    className="fixed bottom-20 sm:bottom-25 w-9/10 py-3.5 sm:py-7 bg-gray-100 text-[var(--dark-def)] text-sm hover:bg-gray-200 rounded-xl  transition"
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
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-[90%] max-w-sm flex flex-col items-center text-center mx-3">
              <div className="w-48 h-48 flex items-center justify-center">
                <img src={submittedGif} alt="Submitted" />
              </div>

              <h2 className="text-2xl font-semibold mt-4 text-[var(--dark-def)]">
                Submitted!
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                Your ad has been posted successfully.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    resetForm();
                  }}
                  className="w-full py-3 rounded-xl bg-[var(--dark-def)] text-white hover:bg-[var(--div-active)] hover:text-[var(--dark-def)] border hover:border-[var(--dark-def)] active:scale-98 transition"
                >
                  Post New
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-[90%] max-w-sm flex flex-col items-center text-center mx-3">
              <h2 className="text-lg font-semibold text-[var(--dark-def)] mb-2">
                Would you want to save this location for future use?
              </h2>

              <p className="text-sm text-gray-600 mb-4 flex flex-row justify-center place-items-center">
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
                className="w-full border border-[var(--div-border)] rounded-xl p-3 mb-6 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--dark-def)]"
              />

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    const ok = saveCurrentLocation();
                    if (ok) {
                      toast.success("Saved location locally");
                    } else {
                      toast.error("Could not save location");
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-[var(--dark-def)] text-white hover:bg-[var(--div-active)] hover:text-[var(--dark-def)] border hover:border-[var(--dark-def)] active:scale-98 transition"
                  type="button"
                >
                  Save Location
                </button>

                <button
                  onClick={() => {
                    setNewLocationName("");
                    setShowSaveLocationModal(false);
                  }}
                  className="w-full border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
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
