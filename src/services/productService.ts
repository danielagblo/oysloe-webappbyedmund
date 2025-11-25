import type { Product, ProductPayload, ProductStatus } from "../types/Product";
import { apiClient } from "./apiClient";

export const getProducts = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<Product[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Product[]>(`/products/${query}`);
};

export const getProduct = async (id: number): Promise<Product> => {
  return apiClient.get<Product>(`/products/${id}/`);
};

export const createProduct = async (body: ProductPayload): Promise<Product> => {
  return apiClient.post<Product>(`/products/`, body);
};

export const updateProduct = async (
  id: number,
  body: ProductPayload,
): Promise<Product> => {
  return apiClient.put<Product>(`/products/${id}/`, body);
};

export const patchProduct = async (
  id: number,
  body: Partial<ProductPayload>,
): Promise<Product> => {
  return apiClient.patch<Product>(`/products/${id}/`, body);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/products/${id}/`);
};

export const markProductAsTaken = async (
  id: number,
  body: Record<string, unknown> = {},
): Promise<void> => {
  await apiClient.post<void>(`/products/${id}/mark-as-taken/`, body);
};

export const setProductStatus = async (
  id: number,
  body: { status: ProductStatus },
): Promise<void> => {
  await apiClient.put<void>(`/products/${id}/set-status/`, body);
};

export const getRelatedProducts = async (): Promise<Product[]> => {
  return apiClient.get<Product[]>(`/products/related/`);
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
  getRelatedProducts,
};
