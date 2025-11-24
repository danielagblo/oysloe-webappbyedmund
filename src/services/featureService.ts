import type { Feature, FeaturePayload } from "../types/Feature";
import { apiClient } from "./apiClient";

export const getFeatures = async (params?: {
	ordering?: string;
	search?: string;
	subcategory?: number;
}): Promise<Feature[]> => {
	const qs = new URLSearchParams();
	if (params?.ordering) qs.append("ordering", params.ordering);
	if (params?.search) qs.append("search", params.search);
	if (typeof params?.subcategory === "number") qs.append("subcategory", String(params.subcategory));

	const query = qs.toString() ? `?${qs.toString()}` : "";
	return apiClient.get<Feature[]>(`/api-v1/features/${query}`);
};

export const getFeature = async (id: number): Promise<Feature> => {
	return apiClient.get<Feature>(`/api-v1/features/${id}/`);
};

export const createFeature = async (body: FeaturePayload): Promise<Feature> => {
	return apiClient.post<Feature>(`/api-v1/features/`, body);
};

export const updateFeature = async (id: number, body: FeaturePayload): Promise<Feature> => {
	return apiClient.put<Feature>(`/api-v1/features/${id}/`, body);
};

export const patchFeature = async (id: number, body: Partial<FeaturePayload>): Promise<Feature> => {
	return apiClient.patch<Feature>(`/api-v1/features/${id}/`, body);
};

export const deleteFeature = async (id: number): Promise<void> => {
	await apiClient.delete<void>(`/api-v1/features/${id}/`);
};

export default {
	getFeatures,
	getFeature,
	createFeature,
	updateFeature,
	patchFeature,
	deleteFeature,
};
