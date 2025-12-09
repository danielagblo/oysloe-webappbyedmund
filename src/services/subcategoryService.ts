import type { Subcategory, SubcategoryPayload } from "../types/Subcategory";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const getSubcategories = async (params?: {
  category?: number;
  ordering?: string;
  search?: string;
}): Promise<Subcategory[]> => {
  const qs = new URLSearchParams();
  if (typeof params?.category === "number")
    qs.append("category", String(params.category));
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  const resp = await apiClient.get<any>(
    `${endpoints.subcategories.list()}${query}`,
  );
  // Normalise paginated { results: [...] } responses to an array
  if (!Array.isArray(resp) && resp && Array.isArray(resp.results))
    return resp.results as Subcategory[];
  return (resp as Subcategory[]) || [];
};

export const getSubcategory = async (id: number): Promise<Subcategory> => {
  return apiClient.get<Subcategory>(endpoints.subcategories.detail(id));
};

export const createSubcategory = async (
  body: SubcategoryPayload,
): Promise<Subcategory> => {
  return apiClient.post<Subcategory>(endpoints.subcategories.create(), body);
};

export const updateSubcategory = async (
  id: number,
  body: SubcategoryPayload,
): Promise<Subcategory> => {
  return apiClient.put<Subcategory>(endpoints.subcategories.update(id), body);
};

export const patchSubcategory = async (
  id: number,
  body: Partial<SubcategoryPayload>,
): Promise<Subcategory> => {
  return apiClient.patch<Subcategory>(endpoints.subcategories.patch(id), body);
};

export const deleteSubcategory = async (id: number): Promise<void> => {
  await apiClient.delete<void>(endpoints.subcategories.delete(id));
};

export default {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  patchSubcategory,
  deleteSubcategory,
};
