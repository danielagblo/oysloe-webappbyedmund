import { endpoints } from "./endpoints";
import type { Category, CategoryPayload } from "../types/Category";
import { apiClient } from "./apiClient";

export const getCategories = async (params?: {
  ordering?: string;
  search?: string;
}): Promise<Category[]> => {
  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Category[]>(`${endpoints.categories.list}${query}`);
};

export const getCategory = async (id: number): Promise<Category> => {
  return apiClient.get<Category>(endpoints.categories.detail(id));
};

export const createCategory = async (
  body: CategoryPayload,
): Promise<Category> => {
  return apiClient.post<Category>(endpoints.categories.create, body);
};

export const updateCategory = async (
  id: number,
  body: CategoryPayload,
): Promise<Category> => {
  return apiClient.put
    ? apiClient.put<Category>(endpoints.categories.update(id), body)
    : apiClient.patch<Category>(endpoints.categories.patch(id), body);
};

export const patchCategory = async (
  id: number,
  body: Partial<CategoryPayload>,
): Promise<Category> => {
  return apiClient.patch<Category>(endpoints.categories.patch(id), body);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.categories.delete(id));
};

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  patchCategory,
  deleteCategory,
};
