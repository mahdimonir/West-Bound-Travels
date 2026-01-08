import { queryKeys } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch blogs with caching and pagination
 */
export const useBlogs = (options?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: queryKeys.blogs.list(options?.page),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs?${params}`
      );
      const data = await response.json();
      return data.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - blogs update occasionally
  });
};

/**
 * Fetch single blog by slug
 */
export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.blogs.detail(slug),
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`);
      const data = await response.json();
      return data.data;
    },
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
};
