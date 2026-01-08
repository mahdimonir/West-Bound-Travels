import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache persists (garbage collection)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});

// Query keys for consistency
export const queryKeys = {
  boats: {
    all: ['boats'] as const,
    list: (page?: number, limit?: number, type?: string) => 
      ['boats', 'list', { page, limit, type }] as const,
    detail: (id: string) => ['boats', 'detail', id] as const,
    availability: (id: string, checkIn?: string, checkOut?: string) =>
      ['boats', 'availability', id, checkIn, checkOut] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    my: () => ['bookings', 'my'] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
  },
  gallery: {
    all: ['gallery'] as const,
    list: (page?: number, category?: string) => 
      ['gallery', 'list', { page, category }] as const,
  },
  blogs: {
    all: ['blogs'] as const,
    list: (page?: number) => ['blogs', 'list', { page }] as const,
    detail: (slug: string) => ['blogs', 'detail', slug] as const,
  },
  destinations: {
    all: ['destinations'] as const,
  },
  settings: {
    minNights: () => ['settings', 'minNights'] as const,
  },
};
