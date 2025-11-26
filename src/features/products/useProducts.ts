import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  markProductAsTaken,
  setProductStatus,
  getRelatedProducts,
} from "../../services/productService";

import type {
  ProductPayload,
  ProductStatus,
} from "../../types/Product";

// query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: { search?: string; ordering?: string }) =>
    [...productKeys.lists(), params] as const,

  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number | string) =>
    [...productKeys.details(), id] as const,

  related: () => [...productKeys.all, "related"] as const,
};

// useProducts
export const useProducts = (
  params?: { search?: string; ordering?: string }
) =>
  useQuery(
    queryOptions({
      queryKey: productKeys.list(params),
      queryFn: () => getProducts(params),
    })
  );


// useProduct
export const useProduct = (id: number | string) =>
  useQuery(
    queryOptions({
      queryKey: productKeys.detail(id),
      queryFn: () => getProduct(id),
      enabled: !!id,
    })
  );


// useRelatedProduct
export const useRelatedProducts = () =>
  useQuery(
    queryOptions({
      queryKey: productKeys.related(),
      queryFn: getRelatedProducts,
    })
  );


// useCreateProduct
export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: ProductPayload) => createProduct(body),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};


// useUpdateProduct
export const useUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string;
      body: ProductPayload;
    }) => updateProduct(id, body),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });

      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};


// usePatchProduct
export const usePatchProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string;
      body: Partial<ProductPayload>;
    }) => patchProduct(id, body),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};


// useDeleteProduct
export const useDeleteProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteProduct(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};


// useMarkProductAsTaken
export const useMarkProductAsTaken = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string;
      body?: Record<string, unknown>;
    }) => markProductAsTaken(id, body),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};


// useSetProductStatus
export const useSetProductStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string;
      status: ProductStatus;
    }) =>
      setProductStatus(id, {
        status,
      }),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};


