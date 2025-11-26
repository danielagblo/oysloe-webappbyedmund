import type { Product, ProductPayload, ProductStatus } from "../types/Product";
import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";
import mockProductsRaw from "../assets/mocks/products.json";

const products = endpoints.products;
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
export const mockProducts: Product[] = mockProductsRaw as unknown as Product[];

// LIST (with ordering + search)
export const getProducts = async (params?: { ordering?: string; search?: string }): Promise<Product[]> => {
  if (useMocks) {
    let results = [...mockProducts];
    if (params?.search) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    return results;
  }

  const qs = new URLSearchParams();
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.search) qs.append("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return apiClient.get<Product[]>(`${products.list}${query}`);
};

// RETRIEVE
export const getProduct = async (id: number | string): Promise<Product> => {
  if (useMocks) {
    const product = mockProducts.find(p => p.id === +id);
    if (!product) throw new Error("Mock product not found");
    return product;
  }

  return apiClient.get<Product>(products.detail(id));
};

// CREATE
export const createProduct = async (body: ProductPayload): Promise<Product> => {
  if (useMocks) {
    const newProduct: Product = { 
      ...body, 
      id: mockProducts.length + 1, 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      images: [], 
      product_features: [], 
      location: {
      id: 0,
      region: "Greater Accra", 
      name: "Mock City",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, 
    owner: { 
      id: 0, 
      email: "" 
    }, 
    status: "ACTIVE", 
    is_taken: false, 
    pid: body.pid || String(mockProducts.length + 1) 
  };
    mockProducts.push(newProduct);
    console.log("Mock createProduct:", newProduct);
    return newProduct;
  }

  return apiClient.post<Product>(products.create, body);
};

// ---------------------
// UPDATE (PUT)
// ---------------------
export const updateProduct = async (id: number | string, body: ProductPayload): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex(p => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx] = { ...mockProducts[idx], ...body, updated_at: new Date().toISOString() };
    console.log("Mock updateProduct:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.put<Product>(products.update(id), body);
};

// ---------------------
// PATCH
// ---------------------
export const patchProduct = async (id: number | string, body: Partial<ProductPayload>): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex(p => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx] = { ...mockProducts[idx], ...body, updated_at: new Date().toISOString() };
    console.log("Mock patchProduct:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.patch<Product>(products.patch(id), body);
};

// ---------------------
// DELETE
// ---------------------
export const deleteProduct = async (id: number | string): Promise<void> => {
  if (useMocks) {
    const idx = mockProducts.findIndex(p => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts.splice(idx, 1);
    console.log("Mock deleteProduct id:", id);
    return;
  }

  await apiClient.delete(products.delete(id));
};

// ---------------------
// MARK AS TAKEN
// ---------------------
export const markProductAsTaken = async (id: number | string, body: Record<string, unknown> = {}): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex(p => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx].is_taken = true;
    console.log("Mock markProductAsTaken:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.post<Product>(products.markAsTaken(id), body);
};

// ---------------------
// SET STATUS
// ---------------------
export const setProductStatus = async (id: number | string, body: { status: ProductStatus }): Promise<Product> => {
  if (useMocks) {
    const idx = mockProducts.findIndex(p => p.id === +id);
    if (idx === -1) throw new Error("Mock product not found");
    mockProducts[idx].status = body.status;
    console.log("Mock setProductStatus:", mockProducts[idx]);
    return mockProducts[idx];
  }

  return apiClient.put<Product>(products.setStatus(id), body);
};

// ---------------------
// RELATED PRODUCTS
// ---------------------
export const getRelatedProducts = async (): Promise<Product[]> => {
  if (useMocks) return [...mockProducts];

  return apiClient.get<Product[]>(products.related);
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
