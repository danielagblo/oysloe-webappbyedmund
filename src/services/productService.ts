// NOTE: AdMetadata import removed because this helper accepts metadata that may include File objects
import type { Product, ProductPayload, ProductStatus } from "../types/Product";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

// Helper: upload a File to Cloudinary (unsigned preset). Returns the upload response
const uploadToCloudinary = async (file: File) => {
  try {
    const cloudName =
      (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) ||
      (import.meta.env.CLOUDINARY_CLOUD_NAME as string);
    const uploadPreset =
      (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) ||
      (import.meta.env.CLOUDINARY_UPLOAD_PRESET as string);

    if (!cloudName || !uploadPreset) return null;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const resp = await fetch(url, { method: "POST", body: fd });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Cloudinary upload failed: ${resp.status} ${txt}`);
    }
    return await resp.json();
  } catch (e) {
    console.warn("Cloudinary upload error:", e);
    return null;
  }
};

const products = endpoints.products;

// LIST (with ordering + search)
export const getProducts = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<Product[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return apiClient.get<Product[]>(`${products.list}${query}`);
};

// RETRIEVE
export const getProduct = async (id: number | string): Promise<Product> => {
  return apiClient.get<Product>(products.detail(id));
};

// CREATE
export const createProduct = async (body: ProductPayload): Promise<Product> => {
  return apiClient.post<Product>(products.create, body);
};

// ---------------------
// UPDATE (PUT)
// ---------------------
export const updateProduct = async (
  id: number | string,
  body: ProductPayload,
): Promise<Product> => {
  return apiClient.put<Product>(products.update(id), body);
};

// ---------------------
// PATCH
// ---------------------
export const patchProduct = async (
  id: number | string,
  body: Partial<ProductPayload>,
): Promise<Product> => {
  return apiClient.patch<Product>(products.patch(id), body);
};

// ---------------------
// DELETE
// ---------------------
export const deleteProduct = async (id: number | string): Promise<void> => {
  await apiClient.delete(products.delete(id));
};

// ---------------------
// MARK AS TAKEN
// ---------------------
export const markProductAsTaken = async (
  id: number | string,
  body: Record<string, unknown> = {},
): Promise<Product> => {

  // Ensure payload includes `product` field if backend requires it
  const payload = { ...(body || {}) } as Record<string, unknown>;
  if (payload.product == null) payload.product = Number(id);

  return apiClient.post<Product>(products.markAsTaken(id), payload);
};

// ---------------------
// CONFIRM MARK AS TAKEN
// ---------------------
export const confirmMarkProductAsTaken = async (
  id: number | string,
  body: Record<string, unknown> = {},
): Promise<Product> => {
  const payload = { ...(body || {}) } as Record<string, unknown>;
  if (payload.product == null) payload.product = Number(id);

  return apiClient.post<Product>(products.confirmMarkAsTaken(id), payload);
};

// ---------------------
// REPOST PRODUCT (clone a taken product)
// ---------------------
export const repostProduct = async (
  id: number | string,
  body: unknown = {},
): Promise<Product> => {
  // Normalize body: allow callers to pass the product id directly (number|string)
  let payload: Record<string, unknown>;
  if (body == null) {
    payload = { product: Number(id) };
  } else if (typeof body === "number" || typeof body === "string") {
    payload = { product: Number(body) };
  } else if (typeof body === "object") {
    payload = { ...(body as Record<string, unknown>) };
    if (payload.product == null) payload.product = Number(id);
  } else {
    // Unexpected body type — fall back to sending product id
    payload = { product: Number(id) };
  }

  return apiClient.post<Product>(products.repost(id), payload);
};

// ---------------------
// REPORT PRODUCT
// ---------------------
export const reportProduct = async (
  id: number | string,
  body: ProductPayload | Record<string, unknown> = {},
): Promise<Product> => {

  return apiClient.post<Product>(products.report(id), body);
};

// ---------------------
// GET PRODUCT REPORTS / COUNT
// ---------------------
export const getProductReports = async (
  id: number | string,
): Promise<unknown> => {

  // Some backends may not accept filtering via query params on the viewset
  // and could return server errors for unknown filters. To be robust we
  // fetch the top-level list and perform client-side filtering for the
  // requested product id.
  const url = `${endpoints.productReports.list()}`;
  const resp = await apiClient.get<unknown>(url);

  // Normalize to an array of items
  let items: unknown[] = [];
  if (Array.isArray(resp)) items = resp as unknown[];
  else if (
    resp &&
    typeof resp === "object" &&
    Array.isArray((resp as any).results)
  )
    items = (resp as any).results;

  // Filter items whose `product` field matches the requested id. The
  // `product` property may be a number, or an object with an `id` field.
  const pid = Number(id);
  const filtered = items.filter((it) => {
    if (!it || typeof it !== "object") return false;
    const prod = (it as any).product;
    if (prod == null) return false;
    if (typeof prod === "number") return prod === pid;
    if (typeof prod === "object" && typeof prod.id === "number")
      return prod.id === pid;
    return false;
  });

  return filtered;
};

export const getProductReportCount = async (productId: number | string) => {
  return apiClient.get<number>(endpoints.productReports.detail(productId));
};

// ---------------------
// SET STATUS
// ---------------------
export const setProductStatus = async (
  id: number | string,
  body: { status: ProductStatus },
): Promise<Product> => {
  return apiClient.put<Product>(products.setStatus(id), body);
};

// ---------------------
// RELATED PRODUCTS
// ---------------------
export const getRelatedProducts = async (
  productId?: number,
): Promise<Product[]> => {
  // Return a sorted copy (highest `multiplier` first). Keep behavior
  // consistent for mocks and real API responses.
  const sortByMultiplier = (items: Product[]) => {
    try {
      return [...items].sort((a, b) => {
        const ma = Number((a as any).multiplier ?? 0) || 0;
        const mb = Number((b as any).multiplier ?? 0) || 0;
        if (mb !== ma) return mb - ma;
        const ta = Date.parse(
          (a as any).created_at || (a as any).createdAt || "",
        );
        const tb = Date.parse(
          (b as any).created_at || (b as any).createdAt || "",
        );
        if (isFinite(tb) && isFinite(ta)) return tb - ta;
        return 0;
      });
    } catch {
      return items;
    }
  };


  const qs = new URLSearchParams();
  if (productId != null) qs.append("product_id", String(productId));
  const query = qs.toString() ? `?${qs.toString()}` : "";

  const resp = await apiClient.get<Product[]>(`${products.related}${query}`);
  // resp is expected to be an array; sort defensively
  if (Array.isArray(resp)) return sortByMultiplier(resp);
  return resp as unknown as Product[];
};

// ---------------------
// FAVOURITES
// ---------------------
export const getFavourites = async (): Promise<Product[]> => {
  return apiClient.get<Product[]>(endpoints.products.favouritesList());
};

export const toggleFavourite = async (
  id: number | string,
): Promise<Product> => {

  return apiClient.post<Product>(endpoints.products.favourite(id), {});
};

// LIST PRODUCTS FOR OWNER
export const getProductsForOwner = async (
  ownerId?: number,
): Promise<Product[]> => {
  // allow ownerId === 0 in case that's a valid id; only bail on null/undefined
  if (ownerId == null) return [];
  // First try server-side filtering via query param: /products/?owner=<id>
  try {
    const resp = await apiClient.get<unknown>(
      `${endpoints.products.list}?owner=${ownerId}`,
    );
    const list = Array.isArray(resp)
      ? (resp as unknown[])
      : resp && typeof resp === "object" && Array.isArray((resp as any).results)
        ? (resp as any).results
        : [];
    if (list.length > 0) {
      // Defensive: ensure returned items are actually owned by ownerId (server may return mixed shapes)
      const owned = list.filter((p: unknown) => {
        if (!p || typeof p !== "object") return false;
        const pi = p as { owner?: unknown };
        const o = pi.owner;
        if (o == null) return false;
        if (typeof o === "number") return o === ownerId;
        if (typeof o === "object" && typeof (o as any).id === "number")
          return (o as any).id === ownerId;
        return false;
      });
      if (owned.length > 0) return owned as Product[];
      // if server returned items but none match defensively, fall through to client-side filtering
    }
  } catch (e) {
    // ignore and fall back to fetching all and filtering client-side
    void e;
  }

  // Fallback: fetch all products and filter client-side (keeps existing behavior for servers without owner query)
  const all = await getProducts();

  const filtered = all.filter((p) => {
    const o = p.owner as unknown;
    if (typeof o === "number") return o === ownerId;
    const obj = o as { id?: unknown };
    if (obj && typeof obj.id === "number") return obj.id === ownerId;
    return false;
  });

  return filtered;
};

export const createProductFromAd = async (metadata: any) => {
  // Map purpose -> ProductType
  const mapType = (p?: string) => {
    if (!p) return "SALE" as const;
    if (p.toLowerCase() === "sale") return "SALE" as const;
    if (p.toLowerCase() === "rent") return "RENT" as const;
    return "PAYLATER" as const;
  };

  const price =
    metadata.pricing?.monthly?.value ??
    metadata.pricing?.weekly?.value ??
    metadata.pricing?.daily?.value ??
    0;

  const categoryId = Number(metadata.category as unknown as string) || 0;

  const payload: ProductPayload = {
    pid: `ad_${Date.now()}`,
    name: metadata.title,
    type: mapType(metadata.purpose),
    status: "PENDING",
    is_taken: false,
    description:
      typeof metadata.description === "string" && metadata.description.trim()
        ? metadata.description.trim()
        : typeof (metadata as any).desc === "string" &&
          (metadata as any).desc.trim()
          ? (metadata as any).desc.trim()
          : `Posted via app on ${new Date(metadata.createdAt || Date.now()).toLocaleString()}`,
    price: price as unknown as string | number,
    duration:
      metadata.pricing?.monthly?.duration ??
      metadata.pricing?.weekly?.duration ??
      metadata.pricing?.daily?.duration ??
      "",
    category: categoryId,
    // note: some backends accept subcategory; include if provided in metadata
    ...(metadata.subcategory
      ? { subcategory: Number(metadata.subcategory) }
      : {}),
    // Prefer `location_id` (integer) when provided by the ad metadata.
    // Fall back to including the legacy `location` shape/string if present.
    ...(metadata.location_id
      ? { location_id: Number(metadata.location_id) }
      : metadata.location
        ? { location: metadata.location }
        : {}),
  };

  // Helper: convert blob: URL to File by fetching it
  const blobUrlToFile = async (url: string, defaultName = "image") => {
    try {
      // Handle data: URIs directly
      if (url.startsWith("data:")) {
        const parts = url.split(",");
        const meta = parts[0];
        const b64 = parts[1];
        const mimeMatch = meta.match(/data:([^;]+);/);
        const mime = (mimeMatch && mimeMatch[1]) || "image/jpeg";
        const byteString = atob(b64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++)
          ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ab], { type: mime });
        const ext = mime.split("/")[1] || "jpg";
        const name = `${defaultName}-${Date.now()}.${ext}`;
        return new File([blob], name, { type: mime });
      }

      // Fallback for blob: or http(s) URLs
      const res = await fetch(url);
      const blob = await res.blob();
      const mime = blob.type || "image/jpeg";
      const ext = mime.split("/")[1] || "jpg";
      const name = `${defaultName}-${Date.now()}.${ext}`;
      return new File([blob], name, { type: mime });
    } catch (e) {
      console.warn("Failed to convert blob/data URL to File:", e);
      return null;
    }
  };

  const imgs = Array.isArray(metadata.images) ? metadata.images : [];

  // If there is at least one image, send the first image as part of
  // the product creation request (so it populates the product "image"
  // column). Remaining images are uploaded to the productImages
  // endpoint afterwards. For servers that do not accept multipart on
  // product create, the code falls back to a JSON create and will
  // upload all images afterwards.

  const created: Product = await (async () => {
    // determine first image file (if any)
    let firstFile: File | null = null;
    if (imgs.length > 0) {
      try {
        const img0 = imgs[0];
        if (img0 && img0.file instanceof File) {
          firstFile = img0.file;
        } else if (img0 && typeof img0.url === "string") {
          firstFile = await blobUrlToFile(img0.url, `image-0`);
        }
      } catch {
        firstFile = null;
      }
    }

    // For real server: when there's a first file, prefer uploading it to
    // Cloudinary first (unsigned preset). Then send the returned URL/name
    // to the backend in the JSON payload so the backend stores the reference.
    if (firstFile) {
      try {
        const uploadResp = await uploadToCloudinary(firstFile);
        if (uploadResp && (uploadResp.secure_url || uploadResp.url)) {
          // Prefer secure_url when available
          payload.image = uploadResp.secure_url || uploadResp.url;
          // Create product as JSON including the Cloudinary URL
          return await createProduct(payload);
        }
      } catch (e) {
        console.warn("Cloudinary upload failed for first image:", e);
      }

      // Fallback: if Cloudinary not configured or upload failed, attempt
      // the previous multipart/form-data create so servers that expect a
      // direct file can still receive it.
      try {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (typeof v === "object") {
            try {
              fd.append(k, JSON.stringify(v as unknown));
            } catch {
              fd.append(k, String(v));
            }
          } else {
            fd.append(k, String(v));
          }
        });
        fd.append("image", firstFile, (firstFile as File).name);
        return await apiClient.post<Product>(products.create, fd);
      } catch (e) {
        console.warn(
          "Multipart product create failed, falling back to JSON create:",
          e,
        );
        return await createProduct(payload);
      }
    }

    // No first file: create product as JSON
    return await createProduct(payload);
  })();

  // created product returned from API (owner should be set)

  // If the product was created but the owner is null/undefined, abort
  // attachments — this indicates the server didn't associate the auth
  // token with the create request (owner null). Surface a helpful error
  // instead of continuing to upload images/features to an unauthenticated product.
  const ownerObj = (created as any).owner;
  const ownerId =
    ownerObj && typeof ownerObj === "object" ? Number(ownerObj.id) : null;
  if (!ownerId) {
    console.error(
      "Product created without owner. Aborting attachments. Created:",
      created,
    );
    throw new Error(
      "Product was created but owner is null. Ensure the Authorization token is sent with the product creation request.",
    );
  }

  if (imgs.length > 0) {
    // Start uploading from index 0 except when the first image was
    // already attached to the product create request. We detect that
    // by checking whether the server returned an `image` field or if
    // we used a firstFile above during non-mock flow.
    let startIndex = 0;
    // If server returned an `image` property or we had imgs[0].file in mocks,
    // skip uploading index 0
    const createdHasImage = (created as any)?.image != null;
    if (createdHasImage) startIndex = 1;

    for (let i = startIndex; i < imgs.length; i++) {
      const img = imgs[i];
      try {
        let fileObj: File | null = null;
        if (img && img.file instanceof File) {
          fileObj = img.file;
        } else if (img && typeof img.url === "string") {
          fileObj = await blobUrlToFile(img.url, `image-${i}`);
        }
        if (!fileObj) continue;

        // Try uploading image to Cloudinary first and then POST the URL
        // to the productImages endpoint. Fall back to direct file upload
        // if Cloudinary is not configured or the upload fails.
        try {
          const uploadResp = await uploadToCloudinary(fileObj);
          if (uploadResp && (uploadResp.secure_url || uploadResp.url)) {
            const imgUrl = uploadResp.secure_url || uploadResp.url;
            if (import.meta.env.DEV) {
              try {
                console.debug("Attaching product image URL", {
                  product: created.id,
                  url: imgUrl,
                });
              } catch (e) {
                void e;
              }
            }
            await apiClient.post(endpoints.productImages.create(), {
              product: String(created.id),
              image: imgUrl,
            });
            continue;
          }
        } catch (e) {
          console.warn("Cloudinary upload failed for product image:", e);
        }

        // Fallback: original form-data upload to productImages
        const fd = new FormData();
        fd.append("product", String(created.id));
        fd.append("image", fileObj, fileObj.name);

        try {
          if (import.meta.env.DEV) {
            try {
              console.debug("Uploading product image (fallback)", {
                product: created.id,
                name: fileObj.name,
                size: fileObj.size,
                type: fileObj.type,
              });
            } catch (e) {
              void e;
            }
          }

          await apiClient.post(endpoints.productImages.create(), fd);
        } catch (err) {
          console.error(
            "productImages upload failed for",
            { product: created.id, file: fileObj.name },
            err,
          );
          throw err;
        }
      } catch (e) {
        console.error("Failed to upload product image:", e);
        throw e;
      }
    }
  }

  // Attach product features from explicit feature definitions (metadata.featureValues)
  if (
    Array.isArray((metadata as any).featureValues) &&
    (metadata as any).featureValues.length > 0
  ) {
    for (const fv of (metadata as any).featureValues) {
      try {
        // fv shape: { feature: number, value: string }
        const payloadFeatureById = {
          product: (created as any).id,
          feature: Number(fv.feature),
          value: String(fv.value ?? ""),
        };
        try {
          await apiClient.post(
            endpoints.productFeatures.create(),
            payloadFeatureById,
          );
        } catch (err) {
          console.error(
            "product-features (by id) failed",
            payloadFeatureById,
            err,
          );
          // Try an alternative payload key in case backend expects `feature_id`
          try {
            const alt = {
              ...payloadFeatureById,
              feature_id: payloadFeatureById.feature,
            } as { [k: string]: unknown };
            delete (alt as { [k: string]: unknown }).feature;
            await apiClient.post(endpoints.productFeatures.create(), alt);
          } catch (err2) {
            console.error("Retry attaching product feature also failed", err2);
          }
        }
      } catch (e) {
        console.error("Failed to attach product feature (by id):", e);
      }
    }
  }
  // No catalog feature creation here — features must exist on the server and are attached below.

  // Free-text `keyFeatures` are skipped because the backend requires an explicit
  // `feature` id for product-feature attachments. Use the UI to attach
  // existing features (feature id + value) — those are handled above.
  if (
    Array.isArray((metadata as any).keyFeatures) &&
    (metadata as any).keyFeatures.length > 0
  ) {
    console.warn(
      "Skipping free-text keyFeatures upload: backend requires feature id. Convert UI to select existing features instead.",
    );
  }

  return created;
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  markProductAsTaken,
  confirmMarkProductAsTaken,
  setProductStatus,
  getProductsForOwner,
  getRelatedProducts,
  repostProduct,
  // Helper moved to named export
  createProductFromAd,
};
