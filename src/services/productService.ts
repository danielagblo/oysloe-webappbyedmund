import mockProductsRaw from "../assets/mocks/products.json";
// NOTE: AdMetadata import removed because this helper accepts metadata that may include File objects
import type { Product, ProductPayload, ProductStatus } from "../types/Product";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

const products = endpoints.products;
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
export const mockProducts: Product[] = mockProductsRaw as unknown as Product[];

// LIST (with ordering + search)
export const getProducts = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<Product[]> => {
  if (useMocks) {
    let results = [...mockProducts];
    if (params?.search) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(params.search!.toLowerCase()),
      );
    }

    return results;
  }

  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return apiClient.get<Product[]>(`${products.list}${query}`);
};

// RETRIEVE
export const getProduct = async (id: number | string): Promise<Product> => {
  if (useMocks) {
    const product = mockProducts.find((p) => p.id === +id);
    if (!product) throw new Error("Mock product not found");
    return product;
  }

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
  if (useMocks) {
    const idx = mockProducts.findIndex((p) => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx] = {
      ...mockProducts[idx],
      ...body,
      updated_at: new Date().toISOString(),
    };
    console.log("Mock updateProduct:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.put<Product>(products.update(id), body);
};

// ---------------------
// PATCH
// ---------------------
export const patchProduct = async (
  id: number | string,
  body: Partial<ProductPayload>,
): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex((p) => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx] = {
      ...mockProducts[idx],
      ...body,
      updated_at: new Date().toISOString(),
    };
    console.log("Mock patchProduct:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.patch<Product>(products.patch(id), body);
};

// ---------------------
// DELETE
// ---------------------
export const deleteProduct = async (id: number | string): Promise<void> => {
  if (useMocks) {
    const idx = mockProducts.findIndex((p) => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts.splice(idx, 1);
    console.log("Mock deleteProduct id:", id);
    return;
  }

  await apiClient.delete(products.delete(id));
};

// ---------------------
// MARK AS TAKEN
// ---------------------
export const markProductAsTaken = async (
  id: number | string,
  body: Record<string, unknown> = {},
): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex((p) => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx].is_taken = true;
    console.log("Mock markProductAsTaken:", mockProducts[idx]);
    return mockProducts[idx];
  }

  // Ensure payload includes `product` field if backend requires it
  const payload = { ...(body || {}) } as Record<string, unknown>;
  if (payload.product == null) payload.product = Number(id);

  return apiClient.post<Product>(products.markAsTaken(id), payload);
};

// ---------------------
// REPORT PRODUCT
// ---------------------
export const reportProduct = async (
  id: number | string,
  body: ProductPayload | Record<string, unknown> = {},
): Promise<Product> => {
  if (useMocks) {
    const product = mockProducts.find((p) => p.id === +id);
    if (!product) throw new Error("Mock product not found");
    // In mocks just return the product unchanged (report metadata not stored)
    console.log("Mock reportProduct for:", id, body);
    return product;
  }

  return apiClient.post<Product>(products.report(id), body);
};

// ---------------------
// GET PRODUCT REPORTS / COUNT
// ---------------------
export const getProductReports = async (id: number | string): Promise<unknown> => {
  if (useMocks) {
    // No stored reports in mock; return empty array
    return [];
  }

  // Some backends may not accept filtering via query params on the viewset
  // and could return server errors for unknown filters. To be robust we
  // fetch the top-level list and perform client-side filtering for the
  // requested product id.
  const url = `${endpoints.productReports.list()}`;
  const resp = await apiClient.get<unknown>(url);

  // Normalize to an array of items
  let items: unknown[] = [];
  if (Array.isArray(resp)) items = resp as unknown[];
  else if (resp && typeof resp === "object" && Array.isArray((resp as any).results)) items = (resp as any).results;

  // Filter items whose `product` field matches the requested id. The
  // `product` property may be a number, or an object with an `id` field.
  const pid = Number(id);
  const filtered = items.filter((it) => {
    if (!it || typeof it !== "object") return false;
    const prod = (it as any).product;
    if (prod == null) return false;
    if (typeof prod === "number") return prod === pid;
    if (typeof prod === "object" && typeof prod.id === "number") return prod.id === pid;
    return false;
  });

  return filtered;
};

export const getProductReportCount = async (productId: number | string) => {
  return apiClient.get(endpoints.products.report(productId));
};


// ---------------------
// SET STATUS
// ---------------------
export const setProductStatus = async (
  id: number | string,
  body: { status: ProductStatus },
): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex((p) => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx].status = body.status;
    console.log("Mock setProductStatus:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.put<Product>(products.setStatus(id), body);
};

// ---------------------
// RELATED PRODUCTS
// ---------------------
export const getRelatedProducts = async (productId?: number): Promise<Product[]> => {
  if (useMocks) return [...mockProducts];

  const qs = new URLSearchParams();
  if (productId != null) qs.append("product_id", String(productId));
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return apiClient.get<Product[]>(`${products.related}${query}`);
};

// ---------------------
// FAVOURITES
// ---------------------
export const getFavourites = async (): Promise<Product[]> => {
  if (useMocks) {
    return mockProducts.filter(p => Boolean((p as any).favourited_by_user));
  }

  return apiClient.get<Product[]>(endpoints.products.favouritesList());
};

export const toggleFavourite = async (id: number | string): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex(p => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    // toggle favourited flag
    const curr = (mockProducts[idx] as any).favourited_by_user;
    (mockProducts[idx] as any).favourited_by_user = !curr;
    return mockProducts[idx];
  }
  return apiClient.post<Product>(endpoints.products.favourite(id), {});
};

// LIST PRODUCTS FOR OWNER
export const getProductsForOwner = async (ownerId?: number): Promise<Product[]> => {
  // allow ownerId === 0 in case that's a valid id; only bail on null/undefined
  if (ownerId == null) return [];
  // First try server-side filtering via query param: /products/?owner=<id>
  try {
    const resp = await apiClient.get<unknown>(`${endpoints.products.list}?owner=${ownerId}`);
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
        if (typeof o === "object" && typeof (o as any).id === "number") return (o as any).id === ownerId;
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
    if (!p) return ("SALE") as const;
    if (p.toLowerCase() === "sale") return ("SALE") as const;
    if (p.toLowerCase() === "rent") return ("RENT") as const;
    return ("SERVICE") as const;
  };

  const price =
    metadata.pricing?.monthly?.value ?? metadata.pricing?.weekly?.value ?? metadata.pricing?.daily?.value ?? 0;

  const categoryId = Number(metadata.category as unknown as string) || 0;

  const payload: ProductPayload = {
    pid: `ad_${Date.now()}`,
    name: metadata.title,
    type: mapType(metadata.purpose),
    status: "PENDING",
    is_taken: false,
    description: `Posted via app on ${new Date(metadata.createdAt).toLocaleString()}`,
    price: price as unknown as string | number,
    duration: metadata.pricing?.monthly?.duration ?? metadata.pricing?.weekly?.duration ?? metadata.pricing?.daily?.duration ?? "",
    category: categoryId,
    // note: some backends accept subcategory; include if provided in metadata
    ...(metadata.subcategory ? { subcategory: Number(metadata.subcategory) } : {}),
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
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
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

    // If using mocks, keep existing mock flow but set mock image for
    // the created product when we have a first file.
    if (useMocks) {
      const createdMock = await createProduct(payload);
      // set a convenience `image` field on the mock product so UI can
      // read from it (use a blob URL when we have a File)
      if (firstFile) {
        try {
          // createObjectURL is available in browser runtime
          (createdMock as any).image = URL.createObjectURL(firstFile as Blob);
        } catch {
          (createdMock as any).image = (firstFile as any).name ?? null;
        }
      }
      return createdMock;
    }

    // For real server: when there's a first file, send multipart/form-data
    // so the server can save it to the product.image column.
    if (firstFile) {
      const fd = new FormData();
      // append JSON fields from payload (simple scalar fields)
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        // For objects/arrays, stringify (server should handle accordingly)
        if (typeof v === "object") {
          try {
            fd.append(k, JSON.stringify(v as unknown));
          } catch {
            // fallback
            fd.append(k, String(v));
          }
        } else {
          fd.append(k, String(v));
        }
      });
      fd.append("image", firstFile, (firstFile as File).name);

      try {
        return await apiClient.post<Product>(products.create, fd);
      } catch (e) {
        // If multipart create fails, fall back to JSON create so we at
        // least create the product and can upload images afterwards.
        console.warn("Multipart product create failed, falling back to JSON create:", e);
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
  const ownerId = ownerObj && (typeof ownerObj === "object") ? Number(ownerObj.id) : null;
  if (!ownerId) {
     
    console.error("Product created without owner. Aborting attachments. Created:", created);
    throw new Error("Product was created but owner is null. Ensure the Authorization token is sent with the product creation request.");
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

        const fd = new FormData();
        fd.append("product", String(created.id));
        fd.append("image", fileObj, fileObj.name);

        try {
          if (import.meta.env.DEV) {
            try {
              console.debug("Uploading product image", {
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
          console.error("productImages upload failed for", { product: created.id, file: fileObj.name }, err);
          throw err;
        }
      } catch (e) {
        console.error("Failed to upload product image:", e);
        throw e;
      }
    }
  }

  // Attach product features from explicit feature definitions (metadata.featureValues)
  if (Array.isArray((metadata as any).featureValues) && (metadata as any).featureValues.length > 0) {
    for (const fv of (metadata as any).featureValues) {
      try {
        // fv shape: { feature: number, value: string }
        const payloadFeatureById = {
          product: (created as any).id,
          feature: Number(fv.feature),
          value: String(fv.value ?? ""),
        };
        try {
          await apiClient.post(endpoints.productFeatures.create(), payloadFeatureById);
        } catch (err) {
          console.error("product-features (by id) failed", payloadFeatureById, err);
          // Try an alternative payload key in case backend expects `feature_id`
          try {
            const alt = { ...payloadFeatureById, feature_id: payloadFeatureById.feature } as { [k: string]: unknown };
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
  if (Array.isArray((metadata as any).keyFeatures) && (metadata as any).keyFeatures.length > 0) {
    console.warn("Skipping free-text keyFeatures upload: backend requires feature id. Convert UI to select existing features instead.");
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
  setProductStatus,
  getProductsForOwner,
  getRelatedProducts,
  // Helper moved to named export
  createProductFromAd,
};
