import type { Feedback, FeedbackPayload } from "../types/Feedback";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getFeedbacks = async (params?: { ordering?: string; user?: number }): Promise<Feedback[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (typeof params?.user === "number") qs.append("user", String(params.user));
  const query = qs.toString() ? `?${qs.toString()}` : "";
  const res = await apiClient.get<Feedback[] | { results: Feedback[] }>(endpoints.feedback.listWithQuery(query));
  if (Array.isArray(res)) return res as Feedback[];
  if (res && Array.isArray(res.results)) return res.results as Feedback[];
  return [];
};

export const createFeedback = async (body: FeedbackPayload): Promise<Feedback> => {
  return apiClient.post<Feedback>(endpoints.feedback.create(), body);
};

export const deleteFeedback = async (id: number): Promise<void> => {
  await apiClient.delete(endpoints.feedback.delete(id));
};

export default {
  getFeedbacks,
  createFeedback,
  deleteFeedback,
};