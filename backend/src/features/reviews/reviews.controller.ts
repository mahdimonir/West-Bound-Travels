import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./reviews.service.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "./reviews.validation.js";

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const validatedData = createReviewSchema.parse(req.body);

      const review = await ReviewService.createReview(userId, validatedData);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  static async getByBoat(req: Request, res: Response, next: NextFunction) {
    try {
      const { boatId } = req.params;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;

      const result = await ReviewService.getReviewsByBoat(boatId, {
        limit,
        offset,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getMyReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const reviews = await ReviewService.getReviewsByUser(userId);
      res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const validatedData = updateReviewSchema.parse(req.body);

      const review = await ReviewService.updateReview(
        id,
        userId,
        validatedData
      );
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await ReviewService.deleteReview(id, userId);
      res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Admin routes
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;
      const boatId = req.query.boatId as string | undefined;

      const result = await ReviewService.getAllReviews({
        limit,
        offset,
        boatId,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["PENDING", "APPROVE"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      const review = await ReviewService.updateReviewStatus(id, status);
      res.json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }
}
