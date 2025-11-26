import { useQuery } from '@tanstack/react-query';
import { getReviews } from '../../services/reviewService';
import type { Review } from '../../types/Review';

export type UseReviewsParams = {
  product?: number;
  user?: number;
  search?: string;
  ordering?: string;
};

export function useReviews(params?: UseReviewsParams) {
  const queryKey = ['reviews', params ?? {}] as const;

  const query = useQuery<Review[]>({
    queryKey,
    queryFn: async () => {
      const res = await getReviews(params);
      return res;
    },
    staleTime: 1000 * 60 * 2,
  });

  return {
    reviews: query.data ?? [],
    count: query.data ? query.data.length : 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useReviewsByOwner(ownerId?: number) {
  const queryKey = ['reviews', 'owner', ownerId] as const;
  const query = useQuery<Review[]>({
    queryKey,
    queryFn: async () => {
      if (!ownerId) return [];
      const { getReviewsForOwner } = await import('../../services/reviewService');
      const res = await getReviewsForOwner(ownerId);
      return res;
    },
    staleTime: 1000 * 60 * 2,
  });

  return {
    reviews: query.data ?? [],
    count: query.data ? query.data.length : 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useReviews;
