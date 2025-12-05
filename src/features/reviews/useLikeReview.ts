import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeReview } from "../../services/reviewService";
import type { LikeReviewPayload } from "../../types/Review";

export function useLikeReview(reviewId: number) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body?: LikeReviewPayload) => likeReview(reviewId, body),
    onSuccess: (data) => {
      // update the cached single review
      qc.setQueryData(["review", reviewId], data);
      // also invalidate reviews list so counts refresh where needed
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  return mutation;
}

export default useLikeReview;
