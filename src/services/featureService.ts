import type { Feature, FeaturePayload } from "../types/Feature";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getFeatures = async (params?: {
  ordering?: string;
  search?: string;
  subcategory?: number;
}): Promise<Feature[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);
  if (typeof params?.subcategory === "number")
    qs.append("subcategory", String(params.subcategory));

  const query = qs.toString() ? `?${qs.toString()}` : "";
  const resp = await apiClient.get<any>(`${endpoints.features.list()}${query}`);
  if (!Array.isArray(resp) && resp && Array.isArray(resp.results))
    return resp.results as Feature[];
  return (resp as Feature[]) || [];
};

export const getFeature = async (id: number): Promise<Feature> => {
  return apiClient.get<Feature>(endpoints.features.detail(id));
};

export const createFeature = async (body: FeaturePayload): Promise<Feature> => {
  return apiClient.post<Feature>(endpoints.features.create(), body);
};

export const updateFeature = async (
  id: number,
  body: FeaturePayload,
): Promise<Feature> => {
  return apiClient.put<Feature>(endpoints.features.update(id), body);
};

export const patchFeature = async (
  id: number,
  body: Partial<FeaturePayload>,
): Promise<Feature> => {
  return apiClient.patch<Feature>(endpoints.features.patch(id), body);
};

export const deleteFeature = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.features.delete(id));
};

export const getPossibleFeatureValues = async (params?: {
  feature?: number;
  subcategory?: number;
}): Promise<Record<number, string[]>> => {
  const qs = new URLSearchParams();
  if (typeof params?.feature === "number")
    qs.append("feature", String(params.feature));
  if (typeof params?.subcategory === "number")
    qs.append("subcategory", String(params.subcategory));

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Record<number, string[]>>(
    `${endpoints.possibleFeatureValues.list()}${query}`,
  );
};

export default {
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  patchFeature,
  deleteFeature,
};
