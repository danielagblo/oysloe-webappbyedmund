import { createQueryHook, createMutationHook } from "../../utils/queryFactory";
import {
  getProductFeatures,
  getProductFeature,
  createProductFeature,
  updateProductFeature,
  patchProductFeature,
  deleteProductFeature,
} from "../../services/productFeatureService";

// Queries
export const useProductFeatures = createQueryHook("productFeatures", getProductFeatures);
export const useProductFeature = createQueryHook("productFeature", getProductFeature);

// Mutations
export const useCreateProductFeature = createMutationHook("createProductFeature", createProductFeature);
export const useUpdateProductFeature = createMutationHook("updateProductFeature", updateProductFeature);
export const usePatchProductFeature = createMutationHook("patchProductFeature", patchProductFeature);
export const useDeleteProductFeature = createMutationHook("deleteProductFeature", deleteProductFeature);