import { queryKeys } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch destinations with caching
 */
export const useDestinations = () => {
  return useQuery({
    queryKey: queryKeys.destinations?.all || ['destinations'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations`);
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour - destinations rarely change
  });
};
