import type { ProductImage, ProductImagePayload } from "../types/ProductImage";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getProductImages = async (params?: {
  ordering?: string;
  product?: number;
  search?: string;
}): Promise<ProductImage[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (typeof params?.product === "number")
    qs.append("product", String(params.product));
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<ProductImage[]>(
    `${endpoints.productImages.list()}${query}`,
  );
};

export const getProductImage = async (id: number): Promise<ProductImage> => {
  return apiClient.get<ProductImage>(endpoints.productImages.detail(id));
};

export const createProductImage = async (
  body: ProductImagePayload,
): Promise<ProductImage> => {
  return apiClient.post<ProductImage>(endpoints.productImages.create(), body);
};

export const updateProductImage = async (
  id: number,
  body: ProductImagePayload,
): Promise<ProductImage> => {
  return apiClient.put<ProductImage>(endpoints.productImages.update(id), body);
};

export const patchProductImage = async (
  id: number,
  body: Partial<ProductImagePayload>,
): Promise<ProductImage> => {
  return apiClient.patch<ProductImage>(endpoints.productImages.patch(id), body);
};

export const deleteProductImage = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.productImages.delete(id));
};

export default {
  getProductImages,
  getProductImage,
  createProductImage,
  updateProductImage,
  patchProductImage,
  deleteProductImage,
};
