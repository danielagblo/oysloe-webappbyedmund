import type { Category, CategoryPayload } from "../types/Category";
import { apiClient } from "./apiClient";

export const getCategories = async (params?: { ordering?: string; search?: string }): Promise<Category[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Category[]>(`/categories/${query}`);
};

export const getCategory = async (id: number): Promise<Category> => {
  return apiClient.get<Category>(`/categories/${id}/`);
};

export const createCategory = async (body: CategoryPayload): Promise<Category> => {
  return apiClient.post<Category>(`/categories/`, body);
};

export const updateCategory = async (id: number, body: CategoryPayload): Promise<Category> => {
  return apiClient.put ? apiClient.put<Category>(`/categories/${id}/`, body) : apiClient.patch<Category>(`/categories/${id}/`, body);
};

export const patchCategory = async (id: number, body: Partial<CategoryPayload>): Promise<Category> => {
  return apiClient.patch<Category>(`/categories/${id}/`, body);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/categories/${id}/`);
};

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  patchCategory,
  deleteCategory,
};
