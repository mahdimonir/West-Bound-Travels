import api from "../api";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  boatId: string;
  userId: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  user?: { id: string; name: string; avatar?: string };
  boat?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateReviewPayload {
  boatId: string;
  rating: number;
  comment: string;
}

export const reviewsService = {
  /** Get reviews for a boat (public) */
  getByBoat: (boatId: string) => api.get<ApiResponse<Review[]>>(`/reviews/boat/${boatId}`),

  /** Create a review */
  create: (data: CreateReviewPayload) => api.post<ApiResponse<Review>>("/reviews", data),

  /** Get current user's reviews */
  getMyReviews: () => api.get<ApiResponse<Review[]>>("/reviews/me"),

  /** Update a review */
  update: (id: string, data: Partial<Pick<Review, "rating" | "comment">>) =>
    api.put<ApiResponse<Review>>(`/reviews/${id}`, data),

  /** Delete a review */
  delete: (id: string) => api.del<ApiResponse<void>>(`/reviews/${id}`),

  /** Get all reviews (admin) */
  getAll: () => api.get<ApiResponse<Review[]>>("/reviews/admin/all"),

  /** Update review status (admin) */
  updateStatus: (id: string, status: ReviewStatus) =>
    api.put<ApiResponse<Review>>(`/reviews/admin/${id}/status`, { status }),
};

export default reviewsService;
