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
  return apiClient.get<Review[]>(endpoints.reviews.listWithQuery(query));
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

export default {
  getReviews,
  getReview,
  createReview,
  updateReview,
  patchReview,
  deleteReview,
};
