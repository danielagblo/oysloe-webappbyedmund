import type { ProductImage, ProductImagePayload } from "../types/ProductImage";
import { apiClient } from "./apiClient";

export const getProductImages = async (params?: {
	ordering?: string;
	product?: number;
	search?: string;
}): Promise<ProductImage[]> => {
	const qs = new URLSearchParams();
	if (params?.ordering) qs.append("ordering", params.ordering);
	if (typeof params?.product === "number") qs.append("product", String(params.product));
	if (params?.search) qs.append("search", params.search);

	const query = qs.toString() ? `?${qs.toString()}` : "";
	return apiClient.get<ProductImage[]>(`/api-v1/product-images/${query}`);
};

export const getProductImage = async (id: number): Promise<ProductImage> => {
	return apiClient.get<ProductImage>(`/api-v1/product-images/${id}/`);
};

export const createProductImage = async (body: ProductImagePayload): Promise<ProductImage> => {
	return apiClient.post<ProductImage>(`/api-v1/product-images/`, body);
};

export const updateProductImage = async (id: number, body: ProductImagePayload): Promise<ProductImage> => {
	return apiClient.put<ProductImage>(`/api-v1/product-images/${id}/`, body);
};

export const patchProductImage = async (id: number, body: Partial<ProductImagePayload>): Promise<ProductImage> => {
	return apiClient.patch<ProductImage>(`/api-v1/product-images/${id}/`, body);
};

export const deleteProductImage = async (id: number): Promise<void> => {
	await apiClient.delete<void>(`/api-v1/product-images/${id}/`);
};

export default {
	getProductImages,
	getProductImage,
	createProductImage,
	updateProductImage,
	patchProductImage,
	deleteProductImage,
};
