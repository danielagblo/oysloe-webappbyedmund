import type { Review, ReviewPayload } from "../types/Review";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getReviews = async (params?: {
  ordering?: string;
  product?: number;
  search?: string;
  user?: number;
}): Promise<Review[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (typeof params?.product === "number")
    qs.append("product", String(params.product));
  if (params?.search) qs.append("search", params.search);
  if (typeof params?.user === "number") qs.append("user", String(params.user));

  const query = qs.toString() ? `?${qs.toString()}` : "";
  const res = await apiClient.get<any>(endpoints.reviews.listWithQuery(query));
  // backend may return either an array or a paginated object { results: [...] }
  if (Array.isArray(res)) return res as Review[];
  if (res && Array.isArray(res.results)) return res.results as Review[];
  return [];
};

export const getReview = async (id: number): Promise<Review> => {
  return apiClient.get<Review>(endpoints.reviews.retrieve(id));
};

export const createReview = async (body: ReviewPayload): Promise<Review> => {
  return apiClient.post<Review>(endpoints.reviews.create(), body);
};

export const updateReview = async (
  id: number,
  body: ReviewPayload,
): Promise<Review> => {
  return apiClient.put<Review>(endpoints.reviews.update(id), body);
};

export const patchReview = async (
  id: number,
  body: Partial<ReviewPayload>,
): Promise<Review> => {
  return apiClient.patch<Review>(endpoints.reviews.partial(id), body);
};

export const deleteReview = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.reviews.delete(id));
};

export const likeReview = async (
  id: number,
  body?: { rating?: number; comment?: string },
): Promise<Review> => {
  return apiClient.post<Review>(endpoints.reviews.like(id), body || {});
};

export default {
  getReviews,
  getReview,
  createReview,
  updateReview,
  patchReview,
  deleteReview,
  likeReview,
};

export const getReviewsForOwner = async (
  ownerId: number,
): Promise<Review[]> => {
  // First, try to fetch reviews filtering by product owner (backend may support product__owner)
  try {
    const direct = await apiClient.get<any>(
      endpoints.reviews.listWithQuery(`?product__owner=${ownerId}`),
    );
    const directList: any[] = Array.isArray(direct)
      ? direct
      : direct && Array.isArray(direct.results)
        ? direct.results
        : [];
    if (directList.length > 0) {
      // Filter out any reviews whose product.owner is null or doesn't match ownerId
      const filtered = directList.filter((rev: any) => {
        const prod = rev?.product;
        if (!prod) return false;
        const o = prod.owner;
        if (o == null) return false;
        if (typeof o === "number") return o === ownerId;
        if (typeof o === "object" && typeof o.id === "number")
          return o.id === ownerId;
        return false;
      });
      return filtered as Review[];
    }
  } catch (e) {
    // ignore and fall back to fetching products
    void e;
  }

  // Fallback: fetch products owned by the owner, then fetch reviews for each product and combine
  const productsResp = await apiClient.get<any>(
    `${endpoints.products.list}?owner=${ownerId}`,
  );
  // support both array and paginated responses
  const products = Array.isArray(productsResp)
    ? productsResp
    : productsResp && Array.isArray(productsResp.results)
      ? productsResp.results
      : [];
  if (products.length === 0) return [];
  // Filter products to those that are actually owned by ownerId (skip null owners)
  const ownedProducts = products.filter((p: any) => {
    if (!p) return false;
    const o = p.owner;
    if (o == null) return false;
    if (typeof o === "number") return o === ownerId;
    if (typeof o === "object" && typeof o.id === "number")
      return o.id === ownerId;
    return false;
  });
  if (ownedProducts.length === 0) return [];
  const productIds: number[] = ownedProducts
    .map((p: any) => p.id)
    .filter((id: any): id is number => typeof id === "number");
  if (productIds.length === 0) return [];
  const promises = productIds.map((pid: number) =>
    getReviews({ product: pid }),
  );
  const results = await Promise.all(promises);
  const flat = results.flat();
  // ensure we only return reviews for the productIds we collected (defensive)
  const idSet = new Set(productIds);
  const final = flat.filter(
    (r: any) =>
      r &&
      r.product &&
      typeof r.product.id === "number" &&
      idSet.has(r.product.id),
  );
  return final as Review[];
};
