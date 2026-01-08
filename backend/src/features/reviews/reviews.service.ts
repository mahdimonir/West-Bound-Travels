// Note: Run 'npm run prisma:generate' to generate Prisma client types
import prisma from "../../config/database.js";
import { NotificationService } from "../notifications/notifications.service.js";

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}

export class ReviewService {
  static async createReview(userId: string, data: CreateReviewInput) {
    // Verify booking belongs to user and is completed/paid
    const booking = await prisma.booking.findFirst({
      where: {
        id: data.bookingId,
        userId,
        status: { in: ["CONFIRMED", "PAID"] },
      },
      include: {
        boat: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!booking) {
      throw {
        status: 404,
        message: "Booking not found or not eligible for review",
      };
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: data.bookingId },
    });

    if (existingReview) {
      throw { status: 400, message: "Review already exists for this booking" };
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw { status: 400, message: "Rating must be between 1 and 5" };
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        boatId: booking.boatId,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        boat: { select: { name: true } },
      },
    });

    // Send notification to admin about new review
    try {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { id: true },
      });

      for (const admin of admins) {
        await NotificationService.createNotification(
          admin.id,
          "New Review Submitted",
          `A new review (${data.rating}/5) has been submitted for ${booking.boat.name}`
        );
      }
    } catch (error) {
      console.error("Failed to send review notification:", error);
    }

    return review;
  }

  static async getReviewsByBoat(
    boatId: string,
    options?: { limit?: number; offset?: number }
  ) {
    const reviews = await prisma.review.findMany({
      where: {
        boatId,
        status: "APPROVE",
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    const total = await prisma.review.count({
      where: { boatId, status: "APPROVE" },
    });

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { boatId, status: "APPROVE" },
      _avg: { rating: true },
    });

    return {
      reviews,
      pagination: {
        total,
        limit: options?.limit,
        offset: options?.offset || 0,
      },
      averageRating: avgRating._avg.rating || 0,
    };
  }

  static async getReviewsByUser(userId: string) {
    return prisma.review.findMany({
      where: { userId },
      include: {
        boat: { select: { name: true, images: true } },
        booking: { select: { checkIn: true, checkOut: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateReview(
    reviewId: string,
    userId: string,
    data: { rating?: number; comment?: string }
  ) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw { status: 404, message: "Review not found" };
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw { status: 400, message: "Rating must be between 1 and 5" };
    }

    return prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating && { rating: data.rating }),
        ...(data.comment && { comment: data.comment }),
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        boat: { select: { name: true } },
      },
    });
  }

  static async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw { status: 404, message: "Review not found" };
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return { success: true, message: "Review deleted successfully" };
  }

  // Admin: Get all reviews with pagination
  static async getAllReviews(options?: {
    limit?: number;
    offset?: number;
    boatId?: string;
  }) {
    const where: any = {
      ...(options?.boatId && { boatId: options.boatId }),
    };

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        boat: { select: { id: true, name: true } },
        booking: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    const total = await prisma.review.count({ where });

    return {
      reviews,
      pagination: {
        total,
        limit: options?.limit,
        offset: options?.offset || 0,
      },
    };
  }

  // Admin: Update review status (PENDING -> APPROVE)
  static async updateReviewStatus(
    reviewId: string,
    status: "PENDING" | "APPROVE"
  ) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw { status: 404, message: "Review not found" };
    }

    return prisma.review.update({
      where: { id: reviewId },
      data: { status },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        boat: { select: { name: true } },
      },
    });
  }
}
