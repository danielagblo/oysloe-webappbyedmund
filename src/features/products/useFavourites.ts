import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productService from "../../services/productService";
import { productKeys } from "./useProducts";

export const FAVOURITES_QUERY_KEY = ["products", "favourites"] as const;

export default function useFavourites() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: FAVOURITES_QUERY_KEY,
    queryFn: productService.getFavourites,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (id: number | string) => productService.toggleFavourite(id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["products"] });
      // if we know the product id that was toggled, invalidate the
      // specific product detail so components showing totals (e.g.
      // `total_favourites`) refetch and update.
      if (variables != null) {
        qc.invalidateQueries({ queryKey: productKeys.detail(variables) });
      }
    },
  });

  return {
    ...query,
    toggleFavourite: mutation,
  };
}
