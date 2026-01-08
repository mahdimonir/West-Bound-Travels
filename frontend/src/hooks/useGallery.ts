import { queryKeys } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch gallery images with caching and pagination
 */
export const useGallery = (options?: {
  page?: number;
  limit?: number;
  category?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.gallery.list(options?.page, options?.category),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.category) params.append('category', options.category);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery?${params}`
      );
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour - gallery images don't change often
  });
};
