import { blogsService, boatsService, bookingsService, destinationsService, galleryService, usersService, type BlogWithDetails, type BookingWithDetails, type GalleryItem, type UserProfile } from '@/lib/services';
import { Boat, Destination } from '@/types';
import useSWR from 'swr';

// Helper to handle nested API responses
function extractArray<T>(response: any, key?: string): T[] {
  if (!response?.data) return [];
  const data = key ? (response.data[key] || response.data) : response.data;
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch all blogs with SWR
 */
export function useBlogs() {
  const { data, error, isLoading, mutate } = useSWR(
    '/blogs',
    async () => {
      const res = await blogsService.getAll();
      return extractArray<BlogWithDetails>(res, 'blogs');
    },
    { revalidateOnFocus: false }
  );

  return {
    blogs: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Fetch all boats with SWR
 */
export function useBoats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/boats',
    async () => {
      const res = await boatsService.getBoats();
      const boats = extractArray<any>(res);
      // Map API response to frontend Boat type
      return boats.map((b: any): Boat => ({
        id: b.id ?? b._id,
        _id: b.id ?? b._id,
        name: b.name,
        type: b.type === 'NON_AC' ? 'Non-AC' : b.type,
        rooms: Array.isArray(b.rooms) ? b.rooms : [],
        totalRooms: b.totalRooms ?? 7,
        images: b.images ?? [],
        description: b.description ?? '',
        features: b.features ?? [],
        isActive: b.isActive ?? true,
      }));
    },
    { revalidateOnFocus: false }
  );

  return {
    boats: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Fetch all destinations with SWR
 */
export function useDestinations() {
  const { data, error, isLoading, mutate } = useSWR(
    '/destinations',
    async () => {
      const res = await destinationsService.getAll();
      const destinations = extractArray<any>(res);
      // Map API response to frontend Destination type
      return destinations.map((d: any): Destination => ({
        id: d.id ?? d._id,
        name: d.name,
        description: d.description ?? '',
        images: d.images ?? [],
        location: d.location ?? '',
        createdAt: d.createdAt,
      }));
    },
    { revalidateOnFocus: false }
  );

  return {
    destinations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Fetch all gallery items with SWR
 */
export function useGallery() {
  const { data, error, isLoading, mutate } = useSWR(
    '/gallery',
    async () => {
      const res = await galleryService.list();
      return extractArray<GalleryItem>(res);
    },
    { revalidateOnFocus: false }
  );

  return {
    galleryItems: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Fetch all bookings with SWR
 */
export function useBookings() {
  const { data, error, isLoading, mutate } = useSWR(
    '/bookings',
    async () => {
      const res = await bookingsService.getAllBookings();
      return extractArray<BookingWithDetails>(res, 'bookings');
    },
    { revalidateOnFocus: false }
  );

  return {
    bookings: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Fetch all users with SWR
 */
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    '/users',
    async () => {
      const res = await usersService.getAllUsers();
      return extractArray<UserProfile>(res, 'users');
    },
    { revalidateOnFocus: false }
  );

  return {
    users: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
