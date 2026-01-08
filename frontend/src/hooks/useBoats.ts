import { queryKeys } from '@/lib/queryClient';
import { boatsService } from '@/lib/services';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch all boats with caching and pagination
 */
export const useBoats = (options?: {
  page?: number;
  limit?: number;
  type?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.boats.list(options?.page, options?.limit, options?.type),
    queryFn: async () => {
      const response = await boatsService.getBoats();
      return response.data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - boats don't change often
  });
};

/**
 * Fetch single boat details
 */
export const useBoat = (id: string) => {
  return useQuery({
    queryKey: queryKeys.boats.detail(id),
    queryFn: async () => {
      const response = await boatsService.getBoat(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
};
