import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productService from "../../services/productService";

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    ...query,
    toggleFavourite: mutation,
  };
}
