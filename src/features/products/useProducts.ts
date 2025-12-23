import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  confirmMarkProductAsTaken,
  createProduct,
  deleteProduct,
  getProduct,
  getProductReportCount,
  getProducts,
  getProductsForOwner,
  getRelatedProducts,
  markProductAsTaken,
  patchProduct,
  reportProduct,
  repostProduct,
  setProductStatus,
  updateProduct,
} from "../../services/productService";

import type {
  Product,
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
  detail: (id: number | string) => [...productKeys.details(), id] as const,

  related: (id?: number) => [...productKeys.all, "related", id] as const,
  reports: (id?: number) => [...productKeys.all, "reports", id] as const,
};

// useProducts
export const useProducts = (params?: { search?: string; ordering?: string }) =>
  useQuery(
    queryOptions({
      queryKey: productKeys.list(params),
      // Wrap the service call so we can enforce client-side ordering by
      // `multiplier` (highest first) when the backend does not provide
      // that ordering. This keeps existing `getProducts` behavior while
      // ensuring premium/boosted owners appear before others.
      queryFn: async () => {
        const items = await getProducts(params);
        try {
          // Sort by numeric multiplier (desc). Treat missing/non-numeric as 0.
          return [...items].sort((a, b) => {
            const ma = Number((a as any).multiplier ?? 0) || 0;
            const mb = Number((b as any).multiplier ?? 0) || 0;
            // Higher multiplier first
            if (mb !== ma) return mb - ma;
            // Preserve original relative order for equal multipliers by
            // falling back to created_at (newest first) if available.
            const ta = Date.parse(
              (a as any).created_at || (a as any).createdAt || "",
            );
            const tb = Date.parse(
              (b as any).created_at || (b as any).createdAt || "",
            );
            if (isFinite(tb) && isFinite(ta)) return tb - ta;
            return 0;
          });
        } catch (e) {
          // If sorting fails for any reason, return unsorted list to avoid
          // breaking the UI.
          return items;
        }
      },
    }),
  );

// useProduct
export const useProduct = (id: number | string) =>
  useQuery(
    queryOptions({
      queryKey: productKeys.detail(id),
      queryFn: () => getProduct(id),
      enabled: !!id,
    }),
  );

// useRelatedProduct
export const useRelatedProducts = (productId?: number) =>
  useQuery(
    queryOptions({
      queryKey: productKeys.related(productId),
      queryFn: () => getRelatedProducts(productId),
      enabled: productId != null,
    }),
  );

// useProductReportCount
export const useProductReportCount = (productId?: number) =>
  useQuery<number>({
    queryKey: productKeys.reports(productId),
    queryFn: () => getProductReportCount(productId as number),
    enabled: productId != null,
    staleTime: 1000 * 60 * 10, // 10 minute
  });

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
    mutationFn: ({ id, body }: { id: number | string; body: ProductPayload }) =>
      updateProduct(id, body),

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

// Hook to confirm the mark-as-taken action (actually sets is_taken)
export const useConfirmMarkAsTaken = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string;
      body?: Record<string, unknown>;
    }) => confirmMarkProductAsTaken(id, body),

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

// useProductsForOwner
export const useOwnerProducts = (ownerId?: number | null) => {
  const queryKey = [...productKeys.all, "for-owner", ownerId] as const;

  return useQuery<Product[]>({
    queryKey,
    // only run when ownerId is not null/undefined (allow 0)
    enabled: ownerId != null,
    queryFn: () => getProductsForOwner(ownerId as number),
    staleTime: 1000 * 60 * 10,
  });
};

// useReportProduct
export const useReportProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string;
      body?: Record<string, unknown>;
    }) => reportProduct(id, body),
    onSuccess: (_data, variables) => {
      // Invalidate product detail to refetch and get updated total_reports
      qc.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: productKeys.all });
      // Also invalidate the report count query
      qc.invalidateQueries({
        queryKey: productKeys.reports(Number(variables.id)),
      });
    },
  });
};

// useRepostProduct - clone a taken product to create a new draft
export const useRepostProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string;
      body?: Record<string, unknown>;
    }) => repostProduct(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      qc.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
