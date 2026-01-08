import { queryKeys } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch minimum booking nights setting
 */
export const useMinNights = () => {
  return useQuery({
    queryKey: queryKeys.settings.minNights(),
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/min-nights`);
      const data = await response.json();
      return data.success ? data.data.minNights : 1;
    },
    staleTime: 60 * 60 * 1000, // 1 hour - settings rarely change
    gcTime: 60 * 60 * 1000,
  });
};
