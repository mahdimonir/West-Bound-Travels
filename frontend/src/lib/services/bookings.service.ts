import api from "../api";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PAID" | "REFUNDED";

export interface BookingWithDetails {
  id: string;
  boatId: string;
  roomsBooked: { type: string; quantity: number }[];
  checkIn: string;
  checkOut: string;
  pax: number;
  places: string[];
  price?: number;
  totalPrice?: number;
  status: BookingStatus;
  transactionId?: string;
  paymentMethod?: string;
  userId?: string;
  user?: { id: string; name: string; email: string };
  boat?: { id: string; name: string; type: string; rooms?: any[] };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateBookingPayload {
  boatId: string;
  roomsBooked: { type: string; quantity: number }[];
  dates: { checkIn: string; checkOut: string };
  pax: number;
  places: string[];
}

export const bookingsService = {
  /** Create a new booking */
  createBooking: (data: CreateBookingPayload) =>
    api.post<ApiResponse<BookingWithDetails>>("/bookings", data),

  /** Check availability for boat */
  checkAvailability: (boatId: string, checkIn: string, checkOut: string) =>
    api.get<ApiResponse<Record<string, { total: number; booked: number; available: number }>>>("/bookings/availability", {
      params: { boatId, checkIn, checkOut }
    }),

  /** Get current user's bookings */
  getMyBookings: () => api.get<ApiResponse<BookingWithDetails[]>>("/bookings/my"),

  /** Get single booking by ID */
  getBooking: (id: string) => api.get<ApiResponse<BookingWithDetails>>(`/bookings/${id}`),

  /** Get all bookings (admin) */
  /** Get all bookings (admin) */
  getAllBookings: (params?: { limit?: number; offset?: number; status?: string; userId?: string }) =>
    api.get<ApiResponse<BookingWithDetails[]>>("/bookings/admin/all", { params }),

  /** Update booking status (admin) */
  updateBookingStatus: (id: string, status: BookingStatus) =>
    api.patch<ApiResponse<BookingWithDetails>>(`/bookings/admin/${id}/status`, { status }),
};

export default bookingsService;
