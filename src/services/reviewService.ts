import type { Review, ReviewPayload } from "../types/Review";
import { apiClient } from "./apiClient";

export const getReviews = async (params?: {
	ordering?: string;
	product?: number;
	search?: string;
	user?: number;
}): Promise<Review[]> => {
	const qs = new URLSearchParams();
	if (params?.ordering) qs.append("ordering", params.ordering);
	if (typeof params?.product === "number") qs.append("product", String(params.product));
	if (params?.search) qs.append("search", params.search);
	if (typeof params?.user === "number") qs.append("user", String(params.user));

	const query = qs.toString() ? `?${qs.toString()}` : "";
	return apiClient.get<Review[]>(`/api-v1/reviews/${query}`);
};

export const getReview = async (id: number): Promise<Review> => {
	return apiClient.get<Review>(`/api-v1/reviews/${id}/`);
};

export const createReview = async (body: ReviewPayload): Promise<Review> => {
	return apiClient.post<Review>(`/api-v1/reviews/`, body);
};

export const updateReview = async (id: number, body: ReviewPayload): Promise<Review> => {
	return apiClient.put<Review>(`/api-v1/reviews/${id}/`, body);
};

export const patchReview = async (id: number, body: Partial<ReviewPayload>): Promise<Review> => {
	return apiClient.patch<Review>(`/api-v1/reviews/${id}/`, body);
};

export const deleteReview = async (id: number): Promise<void> => {
	await apiClient.delete<void>(`/api-v1/reviews/${id}/`);
};

export default {
	getReviews,
	getReview,
	createReview,
	updateReview,
	patchReview,
	deleteReview,
};
