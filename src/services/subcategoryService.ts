import type { Subcategory, SubcategoryPayload } from "../types/Subcategory";
import { apiClient } from "./apiClient";

export const getSubcategories = async (params?: {
	category?: number;
	ordering?: string;
	search?: string;
}): Promise<Subcategory[]> => {
	const qs = new URLSearchParams();
	if (typeof params?.category === "number") qs.append("category", String(params.category));
	if (params?.ordering) qs.append("ordering", params.ordering);
	if (params?.search) qs.append("search", params.search);

	const query = qs.toString() ? `?${qs.toString()}` : "";
	return apiClient.get<Subcategory[]>(`/subcategories/${query}`);
};

export const getSubcategory = async (id: number): Promise<Subcategory> => {
	return apiClient.get<Subcategory>(`/subcategories/${id}/`);
};

export const createSubcategory = async (body: SubcategoryPayload): Promise<Subcategory> => {
	return apiClient.post<Subcategory>(`/subcategories/`, body);
};

export const updateSubcategory = async (id: number, body: SubcategoryPayload): Promise<Subcategory> => {
	return apiClient.put<Subcategory>(`/subcategories/${id}/`, body);
};

export const patchSubcategory = async (id: number, body: Partial<SubcategoryPayload>): Promise<Subcategory> => {
	return apiClient.patch<Subcategory>(`/subcategories/${id}/`, body);
};

export const deleteSubcategory = async (id: number): Promise<void> => {
	await apiClient.delete<void>(`/subcategories/${id}/`);
};

export default {
	getSubcategories,
	getSubcategory,
	createSubcategory,
	updateSubcategory,
	patchSubcategory,
	deleteSubcategory,
};
