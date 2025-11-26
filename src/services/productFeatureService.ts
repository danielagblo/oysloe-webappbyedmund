import type {
    ProductFeature,
    ProductFeaturePayload,
} from "../types/ProductFeature";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getProductFeatures = async (params?: {
  feature?: number;
  ordering?: string;
  product?: number;
  search?: string;
}): Promise<ProductFeature[]> => {
  const qs = new URLSearchParams();
  if (typeof params?.feature === "number")
    qs.append("feature", String(params.feature));
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (typeof params?.product === "number")
    qs.append("product", String(params.product));
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<ProductFeature[]>(`${endpoints.productFeatures.list()}${query}`);
};

export const getProductFeature = async (
  id: number,
): Promise<ProductFeature> => {
  return apiClient.get<ProductFeature>(endpoints.productFeatures.detail(id));
};

export const createProductFeature = async (
  body: ProductFeaturePayload,
): Promise<ProductFeature> => {
  return apiClient.post<ProductFeature>(endpoints.productFeatures.create(), body);
};

export const updateProductFeature = async (
  id: number,
  body: ProductFeaturePayload,
): Promise<ProductFeature> => {
  return apiClient.put<ProductFeature>(endpoints.productFeatures.update(id), body);
};

export const patchProductFeature = async (
  id: number,
  body: Partial<ProductFeaturePayload>,
): Promise<ProductFeature> => {
  return apiClient.patch<ProductFeature>(endpoints.productFeatures.patch(id), body);
};

export const deleteProductFeature = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.productFeatures.delete(id));
};

export default {
  getProductFeatures,
  getProductFeature,
  createProductFeature,
  updateProductFeature,
  patchProductFeature,
  deleteProductFeature,
};
