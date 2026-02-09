import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as categoryService from "../../services/categoryService";
import type { Category, CategoryPayload } from "../../types/Category";

// query keys
const QUERY_KEYS = {
  categories: ["categories"] as const,
  category: (id: number) => ["category", id] as const,
};

// fetch single category
export function useCategory(id: number) {
  return useQuery<Category, Error>({
    queryKey: QUERY_KEYS.category(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

// main hook
export function useCategories(params?: { ordering?: string; search?: string }) {
  const queryClient = useQueryClient();

  // fetch categories
  const categoriesQuery = useQuery<Category[], Error>({
    queryKey: [...QUERY_KEYS.categories, params] as const,
    queryFn: () => categoryService.getCategories(params),
    placeholderData: (prev) => prev,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // create category
  const createCategoryMutation = useMutation<Category, Error, CategoryPayload>({
    mutationFn: (body) => categoryService.createCategory(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories }),
    onError: (err) => console.error("Create category failed:", err.message),
  });

  // update category
  const updateCategoryMutation = useMutation<
    Category,
    Error,
    { id: number; body: CategoryPayload }
  >({
    mutationFn: ({ id, body }) => categoryService.updateCategory(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(id) });
    },
    onError: (err) => console.error("Update category failed:", err.message),
  });

  // patch category
  const patchCategoryMutation = useMutation<
    Category,
    Error,
    { id: number; body: Partial<CategoryPayload> }
  >({
    mutationFn: ({ id, body }) => categoryService.patchCategory(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(id) });
    },
    onError: (err) => console.error("Patch category failed:", err.message),
  });

  // delete category
  const deleteCategoryMutation = useMutation<void, Error, number>({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories }),
    onError: (err) => console.error("Delete category failed:", err.message),
  });

  // clean hook interface
  return {
    // Data
    categories: categoriesQuery.data ?? [],

    // Expose the single-category hook
    useCategory,

    // Status - show loading while fetching OR if using placeholder data (not actual data)
    loading:
      categoriesQuery.isLoading ||
      categoriesQuery.isFetching ||
      createCategoryMutation.isPending ||
      updateCategoryMutation.isPending ||
      patchCategoryMutation.isPending ||
      deleteCategoryMutation.isPending,

    error:
      categoriesQuery.error?.message ||
      createCategoryMutation.error?.message ||
      updateCategoryMutation.error?.message ||
      patchCategoryMutation.error?.message ||
      deleteCategoryMutation.error?.message ||
      null,

    // Fetchers
    refetchCategories: categoriesQuery.refetch,

    // Mutations
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    patchCategory: patchCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
  };
}

export default useCategories;
