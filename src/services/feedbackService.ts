import type { Feedback, FeedbackPayload } from "../types/Feedback";
import { apiClient } from "./apiClient";

export const getFeedbacks = async (params?: {
	ordering?: string;
	search?: string;
}): Promise<Feedback[]> => {
	const qs = new URLSearchParams();
	if (params?.ordering) qs.append("ordering", params.ordering);
	if (params?.search) qs.append("search", params.search);

	const query = qs.toString() ? `?${qs.toString()}` : "";
	return apiClient.get<Feedback[]>(`/api-v1/feedback/${query}`);
};

export const getFeedback = async (id: number): Promise<Feedback> => {
	return apiClient.get<Feedback>(`/api-v1/feedback/${id}/`);
};

export const createFeedback = async (body: FeedbackPayload): Promise<Feedback> => {
	return apiClient.post<Feedback>(`/api-v1/feedback/`, body);
};

export const updateFeedback = async (id: number, body: FeedbackPayload): Promise<Feedback> => {
	return apiClient.put<Feedback>(`/api-v1/feedback/${id}/`, body);
};

export const patchFeedback = async (id: number, body: Partial<FeedbackPayload>): Promise<Feedback> => {
	return apiClient.patch<Feedback>(`/api-v1/feedback/${id}/`, body);
};

export const deleteFeedback = async (id: number): Promise<void> => {
	await apiClient.delete<void>(`/api-v1/feedback/${id}/`);
};

export default {
	getFeedbacks,
	getFeedback,
	createFeedback,
	updateFeedback,
	patchFeedback,
	deleteFeedback,
};
