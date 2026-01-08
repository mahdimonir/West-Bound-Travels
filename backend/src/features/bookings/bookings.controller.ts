import { NextFunction, Request, Response } from "express";
import { BookingService } from "./bookings.service.js";
import { createBookingSchema } from "./bookings.validation.js";

export class BookingController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const parsed = createBookingSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.format(),
        });
      }

      const { boatId, dates, pax, roomsBooked, places } = parsed.data;

      const booking = await BookingService.createBooking(userId, parsed.data);

      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  static async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { boatId, checkIn, checkOut } = req.query;

      if (!boatId || !checkIn || !checkOut) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters: boatId, checkIn, checkOut",
        });
      }

      const availability = await BookingService.checkAvailability(
        boatId as string,
        checkIn as string,
        checkOut as string
      );

      res.status(200).json({ success: true, data: availability });
    } catch (error) {
      next(error);
    }
  }

  static async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const bookings = await BookingService.getUserBookings(userId);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }

  static async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const booking = await BookingService.getBookingById(id, userId);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  // Admin routes
  static async getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;
      const status = req.query.status as string | undefined;
      const userId = req.query.userId as string | undefined;

      const result = await BookingService.getAllBookings({
        limit,
        offset,
        status: status as any,
        userId,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateBookingStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { status, message } = req.body;

      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "Status is required" });
      }

      const booking = await BookingService.updateBookingStatus(
        id,
        status,
        message
      );
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }
}
