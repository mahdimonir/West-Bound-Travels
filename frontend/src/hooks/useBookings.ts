import { queryKeys } from '@/lib/queryClient';
import { bookingsService } from '@/lib/services';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch user's bookings with caching
 */
export const useMyBookings = () => {
  return useQuery({
    queryKey: queryKeys.bookings.my(),
    queryFn: async () => {
      const response = await bookingsService.getMyBookings();
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - bookings change more frequently
  });
};

/**
 * Fetch single booking details
 */
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: async () => {
      const response = await bookingsService.getBooking(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
