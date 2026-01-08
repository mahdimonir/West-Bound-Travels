import { queryKeys } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './useDebounce';

interface AvailabilityResponse {
  available: boolean;
  availableRooms: Record<string, number>;
  message?: string;
}

/**
 * Check boat availability with debouncing for real-time updates
 * @param boatId Boat ID to check
 * @param checkIn Check-in date
 * @param checkOut Check-out date
 * @param debounceMs Debounce delay in milliseconds (default: 500ms)
 */
export const useAvailability = (
  boatId: string,
  checkIn: string,
  checkOut: string,
  debounceMs: number = 500
) => {
  // Debounce the dates to avoid too many API calls
  const debouncedCheckIn = useDebouncedValue(checkIn, debounceMs);
  const debouncedCheckOut = useDebouncedValue(checkOut, debounceMs);

  return useQuery<AvailabilityResponse>({
    queryKey: queryKeys.boats.availability(boatId, debouncedCheckIn, debouncedCheckOut),
    queryFn: async () => {
      const params = new URLSearchParams({
        checkIn: debouncedCheckIn,
        checkOut: debouncedCheckOut,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/boats/${boatId}/availability?${params}`
      );

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!boatId && !!debouncedCheckIn && !!debouncedCheckOut,
    staleTime: 60 * 1000, // 1 minute - availability changes frequently
    retry: 1, // Only retry once for availability checks
  });
};
