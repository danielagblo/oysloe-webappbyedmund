import {
  createPossibleFeatureValue,
  getPossibleFeatureValues,
} from "../../services/featureService";
import {
  createProductFeature,
  deleteProductFeature,
  getProductFeature,
  getProductFeatures,
  patchProductFeature,
  updateProductFeature,
} from "../../services/productFeatureService";
import { createMutationHook, createQueryHook } from "../../utils/queryFactory";

// Queries
export const useProductFeatures = createQueryHook(
  "productFeatures",
  getProductFeatures,
);
export const useProductFeature = createQueryHook(
  "productFeature",
  getProductFeature,
);

// Possible feature values (suggested choices)
export const usePossibleFeatureValues = createQueryHook(
  "possibleFeatureValues",
  getPossibleFeatureValues,
);

// Mutations
export const useCreateProductFeature = createMutationHook(
  "createProductFeature",
  createProductFeature,
);
export const useUpdateProductFeature = createMutationHook(
  "updateProductFeature",
  updateProductFeature,
);
export const usePatchProductFeature = createMutationHook(
  "patchProductFeature",
  patchProductFeature,
);
export const useDeleteProductFeature = createMutationHook(
  "deleteProductFeature",
  deleteProductFeature,
);

export const useCreatePossibleFeatureValue = createMutationHook(
  "createPossibleFeatureValue",
  createPossibleFeatureValue,
);
