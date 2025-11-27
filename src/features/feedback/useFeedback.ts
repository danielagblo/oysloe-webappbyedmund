import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import feedbackService from "../../services/feedbackService";
import type { Feedback, FeedbackPayload } from "../../types/Feedback";

export function useFeedbacks(userId?: number) {
  const query = useQuery<Feedback[]>({
    queryKey: ["feedbacks", userId ?? "all"],
    queryFn: async () => {
      const res = await feedbackService.getFeedbacks(
        userId ? { user: userId } : undefined,
      );
      return res;
    },
    staleTime: 1000 * 60 * 2,
  });

  return {
    feedbacks: query.data ?? [],
    count: query.data ? query.data.length : 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: FeedbackPayload) => {
      return feedbackService.createFeedback(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  return mutation;
}

export default useFeedbacks;
