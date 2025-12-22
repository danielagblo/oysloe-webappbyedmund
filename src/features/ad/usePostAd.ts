import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductFromAd } from "../../services/productService";
import { productKeys } from "../products/useProducts";

export const usePostAd = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (metadata: unknown) => createProductFromAd(metadata as any),
    onSuccess: () => {
      // Invalidate product lists so newly created ads appear
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export default usePostAd;
