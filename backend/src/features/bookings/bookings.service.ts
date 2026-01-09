import { differenceInDays } from "date-fns";
import prisma from "../../config/database.js";
import { emailService } from "../../services/email.service.js";
import { NotificationService } from "../notifications/notifications.service.js";
import { CreateBookingInput } from "./bookings.validation.js";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED";

export class BookingService {
  /**
   * Helper method to auto-complete bookings that are past checkout date
   * Should be called when fetching bookings
   */
  private static async autoCompleteExpiredBookings() {
    const now = new Date();
    
    // Find all PAID or CONFIRMED bookings where checkout date has passed
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: { in: ["PAID", "CONFIRMED"] },
        checkOut: { lt: now },
      },
    });

    // Update them to COMPLETED
    if (expiredBookings.length > 0) {
      await prisma.booking.updateMany({
        where: {
          id: { in: expiredBookings.map((b: { id: string }) => b.id) },
        },
        data: { status: "COMPLETED" },
      });
    }

    return expiredBookings.length;
  }

  /**
   * Check if user can book the same room/date combination
   * Returns true if no active booking exists
   */
  private static async canUserBook(
    userId: string,
    boatId: string,
    roomsBooked: { type: string; quantity: number }[],
    checkIn: Date,
    checkOut: Date
  ): Promise<{ canBook: boolean; reason?: string }> {
    // Check if user has an existing PAID or CONFIRMED booking for same boat/dates
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        boatId,
        status: { in: ["PAID", "CONFIRMED"] },
        OR: [
          {
            checkIn: { lte: checkOut },
            checkOut: { gte: checkIn },
          },
        ],
      },
    });

    if (existingBooking) {
      return {
        canBook: false,
        reason: "You already have an active booking for these dates. Please cancel it first or choose different dates.",
      };
    }

    return { canBook: true };
  }
  static async createBooking(
    userId: string,
    data: CreateBookingInput
  ) {
    const checkIn = new Date(data.dates.checkIn);
    const checkOut = new Date(data.dates.checkOut);

    // Core Business Logic: Calculate Duration
    const nights = differenceInDays(checkOut, checkIn);
    const days = nights + 1; // Basic logic, adjustable
    const totalMeals = days * 2 + nights * 1; // 2 meals/day + 1 snack/night approx logic

    // Get minimum nights from settings (default to 1 if not set)
    const minNightsSetting = await prisma.settings.findUnique({
      where: { key: "MIN_BOOKING_NIGHTS" },
    });
    const minNights = minNightsSetting ? parseInt(minNightsSetting.value) : 1;

    if (nights < minNights) {
      throw { 
        status: 400, 
        message: `Minimum ${minNights} night${minNights > 1 ? 's' : ''} stay required` 
      };
    }

    // Check if user can book (no existing PAID/CONFIRMED booking for same dates)
    const userCanBook = await this.canUserBook(
      userId,
      data.boatId,
      data.roomsBooked,
      checkIn,
      checkOut
    );

    if (!userCanBook.canBook) {
      throw { status: 409, message: userCanBook.reason };
    }

    // TRANSACTION: Check availability & Create
    const newBooking = await prisma.$transaction(async (tx: any) => {
      // 1. Check if boat exists
      const boat = await tx.boat.findUnique({ where: { id: data.boatId } });
      if (!boat) throw { status: 404, message: "Boat not found" };

      // 2. Fetch all overlapping bookings (exclude PENDING, CANCELLED, REFUNDED)
      const overlappingBookings = await tx.booking.findMany({
        where: {
          boatId: data.boatId,
          status: { in: ["PAID", "CONFIRMED", "COMPLETED"] },
          OR: [{ checkIn: { lte: checkOut }, checkOut: { gte: checkIn } }],
        },
      });

      // 3. Aggregate booked rooms from overlapping bookings
      const bookedRoomsCount: Record<string, number> = {};
      overlappingBookings.forEach((b: any) => {
        const rooms = b.roomsBooked as any;
        if (Array.isArray(rooms)) {
          rooms.forEach((r: { type: string; quantity: number }) => {
            bookedRoomsCount[r.type] =
              (bookedRoomsCount[r.type] || 0) + r.quantity;
          });
        }
      });

      // 4. Check against boat capacity
      const boatRoomsArr = (boat.rooms || []) as Array<any>;
      const boatRooms: Record<string, number> = {};
      boatRoomsArr.forEach((r: any) => {
        if (r && r.type) boatRooms[r.type] = r.count || 0;
      });

      for (const reqRoom of data.roomsBooked) {
        const alreadyBooked = bookedRoomsCount[reqRoom.type] || 0;
        const totalAvailable = boatRooms[reqRoom.type] || 0;

        if (alreadyBooked + reqRoom.quantity > totalAvailable) {
          throw {
            status: 409,
            message: `Not enough ${reqRoom.type} rooms available for these dates. ${totalAvailable - alreadyBooked} remaining.`,
          };
        }
      }

      // Get user details for professional record
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true }
      });

      // 3. Calculate Price (Mockup logic - simplified)
      // Real app would fetch room prices from DB/Config
      // Assuming Boat has a base price or room price map.
      // For MVP, letting frontend send price is insecure, so backend MUST calculate.
      // We'll use a placeholder logic: (PricePerNight * Nights * Rooms) or similar.
      // Using boat.pricePerNight as a base multiplier for now.

      let calculatedPrice = 0;
      data.roomsBooked.forEach((r) => {
        // Fetch price from boat metadata
        const roomConfig = boatRoomsArr.find((br) => br.type === r.type);
        const pricePerRoom = roomConfig?.price || 5000; // Use room price, fallback to 5000
        calculatedPrice += pricePerRoom * r.quantity * nights;
      });

      // 4. Create Booking
      const newBooking = await tx.booking.create({
        data: {
          userId,
          boatId: data.boatId,
          checkIn,
          checkOut,
          pax: data.pax,
          roomsBooked: data.roomsBooked as any,
          places: data.places,
          totalPrice: calculatedPrice,
          status: "PENDING" as any,
          customerName: user?.name,
          customerEmail: user?.email,
          customerPhone: user?.phone,
        },
        include: {
          user: { select: { name: true, email: true } },
          boat: { select: { name: true } },
        },
      });

      return newBooking;
    });

    // 5. Send notification and email outside transaction
    try {
      await NotificationService.createNotification(
        userId,
        "Booking Created",
        `Your booking for ${newBooking.boat.name} has been created. Status: PENDING`
      );

      // Send email to user
      await emailService.sendBookingConfirmation(
        newBooking.user.email,
        newBooking.user.name,
        {
          bookingId: newBooking.id,
          boatName: newBooking.boat.name,
          startDate: checkIn.toISOString(),
          endDate: checkOut.toISOString(),
          totalPrice: Number(newBooking.totalPrice),
          status: newBooking.status,
        }
      );
    } catch (error) {
      // Log but don't fail the return
      console.error("Failed to send notification/email:", error);
    }

    return newBooking;
  }

  /**
   * Check room availability for a specific boat and date range
   */
  static async checkAvailability(
    boatId: string,
    checkIn: string | Date,
    checkOut: string | Date
  ) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 1. Get boat details including total rooms
    const boat = await prisma.boat.findUnique({
      where: { id: boatId },
    });

    if (!boat) throw { status: 404, message: "Boat not found" };

    // 2. Fetch all overlapping bookings (exclude PENDING, CANCELLED, REFUNDED)
    // Considering PAID, CONFIRMED, and COMPLETED as taking up space
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        boatId,
        status: { in: ["PAID", "CONFIRMED", "COMPLETED"] },
        OR: [
          { checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } },
        ],
      },
    });

    // 3. Aggregate booked rooms
    const bookedRoomsCount: Record<string, number> = {};
    overlappingBookings.forEach((b: any) => {
      const rooms = b.roomsBooked as any;
      if (Array.isArray(rooms)) {
        rooms.forEach((r: { type: string; quantity: number }) => {
          bookedRoomsCount[r.type] = (bookedRoomsCount[r.type] || 0) + r.quantity;
        });
      }
    });

    // 4. Calculate remaining availability per room type
    const boatRoomsArr = (boat.rooms || []) as Array<any>;
    const availability: Record<string, { total: number; booked: number; available: number }> = {};

    boatRoomsArr.forEach((r: any) => {
      if (r && r.type) {
        const total = r.count || 0;
        const booked = bookedRoomsCount[r.type] || 0;
        availability[r.type] = {
          total,
          booked,
          available: Math.max(0, total - booked),
        };
      }
    });

    return availability;
  }

  static async getUserBookings(userId: string) {
    // Auto-complete expired bookings first
    await this.autoCompleteExpiredBookings();

    return prisma.booking.findMany({
      where: { userId },
      include: {
        boat: { select: { name: true, images: true, type: true, rooms: true } },
        review: { select: { id: true, rating: true, comment: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBookingById(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: {
        boat: true,
        user: { select: { id: true, name: true, email: true } },
        review: true,
      },
    });

    if (!booking) {
      throw { status: 404, message: "Booking not found" };
    }

    return booking;
  }

  // Admin: Update booking status
  static async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    message?: string
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { name: true, email: true } },
        boat: { select: { name: true } },
      },
    });

    if (!booking) {
      throw { status: 404, message: "Booking not found" };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        boat: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    });

    // Send notification and email
    try {
      await NotificationService.createNotification(
        booking.userId,
        "Booking Status Updated",
        `Your booking for ${booking.boat.name} status has been updated to ${status}`
      );

      await emailService.sendBookingStatusUpdate(
        booking.user.email,
        booking.user.name,
        {
          bookingId: booking.id,
          boatName: booking.boat.name,
          status,
          message,
        }
      );
    } catch (error) {
      console.error("Failed to send notification/email:", error);
    }

    return updatedBooking;
  }

  // Admin: Get all bookings
  static async getAllBookings(options?: {
    limit?: number;
    offset?: number;
    status?: BookingStatus;
    userId?: string;
  }) {
    // Auto-complete expired bookings first
    await this.autoCompleteExpiredBookings();

    const where: any = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.userId) {
      where.userId = options.userId;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        boat: { select: { id: true, name: true, images: true, type: true, rooms: true } },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    const total = await prisma.booking.count({ where });

    return {
      bookings,
      pagination: {
        total,
        limit: options?.limit,
        offset: options?.offset || 0,
      },
    };
  }
  // Validate if the booking is still available (for pre-payment check)
  static async validateBookingAvailability(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw { status: 404, message: "Booking not found" };

    const boat = await prisma.boat.findUnique({
      where: { id: booking.boatId },
    });

    if (!boat) throw { status: 404, message: "Boat not found" };

    // Fetch all overlapping bookings (exclude PENDING, CANCELLED, REFUNDED)
    // and exclude current booking (though safe if it's PENDING)
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        boatId: booking.boatId,
        status: { in: ["PAID", "CONFIRMED", "COMPLETED"] },
        id: { not: bookingId },
        OR: [
          { checkIn: { lte: booking.checkOut }, checkOut: { gte: booking.checkIn } },
        ],
      },
    });

    // Aggregate booked rooms
    const bookedRoomsCount: Record<string, number> = {};
    overlappingBookings.forEach((b: any) => {
      const rooms = b.roomsBooked as any;
      if (Array.isArray(rooms)) {
        rooms.forEach((r: { type: string; quantity: number }) => {
          bookedRoomsCount[r.type] =
            (bookedRoomsCount[r.type] || 0) + r.quantity;
        });
      }
    });

    // Check against boat capacity
    const boatRoomsArr = (boat.rooms || []) as Array<any>;
    const boatRooms: Record<string, number> = {};
    boatRoomsArr.forEach((r: any) => {
      if (r && r.type) boatRooms[r.type] = r.count || 0;
    });

    const myRooms = booking.roomsBooked as any;
    if (Array.isArray(myRooms)) {
      for (const reqRoom of myRooms) {
        const alreadyBooked = bookedRoomsCount[reqRoom.type] || 0;
        const totalAvailable = boatRooms[reqRoom.type] || 0;

        if (alreadyBooked + reqRoom.quantity > totalAvailable) {
          throw {
            status: 409, // Conflict
            message: `Booking no longer available. Not enough ${reqRoom.type} rooms left.`,
          };
        }
      }
    }

    return true;
  }
}
