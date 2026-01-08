// Note: Run 'npm run prisma:generate' to generate Prisma client types
type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED";
import prisma from "../../config/database.js";
import { env } from "../../config/env.js";
import { emailService } from "../../services/email.service.js";
import { NotificationService } from "../notifications/notifications.service.js";

export interface PaymentInitiateRequest {
  bookingId: string;
  paymentMethod: "bkash" | "sslcommerz";
}

export interface PaymentCallbackData {
  paymentId: string;
  status: "success" | "failed";
  transactionId?: string;
  amount?: number;
}

export class PaymentService {
  // Initiate bKash payment
  static async initiateBkashPayment(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { 
        user: { select: { name: true, email: true, phone: true } },
        boat: { select: { name: true } }
      },
    });

    if (!booking) {
      throw { status: 404, message: "Booking not found" };
    }

    if (booking.status !== "PENDING") {
      throw { status: 400, message: "Booking is not eligible for payment. It may already be paid or cancelled." };
    }

    // In production, this would call bKash API
    // For now, we'll simulate the payment initiation
    const paymentId = `bkash_${Date.now()}_${bookingId}`;

    // Update booking with payment ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId,
        paymentMethod: "bkash",
      },
    });

    // In production, return bKash payment URL
    // For development, return a mock payment URL
    return {
      paymentId,
      paymentUrl: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/bkash?paymentId=${paymentId}`,
      amount: Number(booking.totalPrice),
      currency: "BDT",
    };
  }

  // Initiate SSLCommerz payment
  static async initiateSSLCommerzPayment(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { 
        user: { select: { name: true, email: true, phone: true } },
        boat: { select: { name: true } }
      },
    });

    if (!booking) {
      throw { status: 404, message: "Booking not found" };
    }

    if (booking.status !== "PENDING") {
      throw { status: 400, message: "Booking is not eligible for payment. It may already be paid or cancelled." };
    }

    // SSLCommerz professional implementation
    const store_id = env.SSLCOMMERZ_STORE_ID;
    const store_passwd = env.SSLCOMMERZ_STORE_PASSWORD;
    const is_sandbox = env.SSLCOMMERZ_SANDBOX === "true";

    const paymentId = `ssl_${Date.now()}_${bookingId}`;

    const sslData = new URLSearchParams();
    sslData.append("store_id", store_id || "");
    sslData.append("store_passwd", store_passwd || "");
    sslData.append("total_amount", booking.totalPrice.toString());
    sslData.append("currency", "BDT");
    sslData.append("tran_id", paymentId);
    sslData.append("success_url", `${env.BACKEND_URL}/api/v1/payments/sslcommerz/success?booking_id=${bookingId}`);
    sslData.append("fail_url", `${env.BACKEND_URL}/api/v1/payments/sslcommerz/fail?booking_id=${bookingId}`);
    sslData.append("cancel_url", `${env.BACKEND_URL}/api/v1/payments/sslcommerz/cancel?booking_id=${bookingId}`);
    sslData.append("ipn_url", `${env.BACKEND_URL}/api/v1/payments/sslcommerz/ipn`);
    sslData.append("cus_name", booking.customerName || booking.user.name);
    sslData.append("cus_email", booking.customerEmail || booking.user.email);
    sslData.append("cus_add1", "Dhaka");
    sslData.append("cus_city", "Dhaka");
    sslData.append("cus_postcode", "1000");
    sslData.append("cus_country", "Bangladesh");
    sslData.append("cus_phone", booking.customerPhone || booking.user.phone || "01700000000");
    sslData.append("shipping_method", "NO");
    sslData.append("product_name", booking.boat.name);
    sslData.append("product_category", "Travel");
    sslData.append("product_profile", "general");

    const baseUrl = is_sandbox
      ? "https://sandbox.sslcommerz.com"
      : "https://securepay.sslcommerz.com";

    const response = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
      method: "POST",
      body: sslData,
    });

    const result = await response.json();

    if (result.status !== "SUCCESS") {
      throw { status: 500, message: result.failedreason || "SSLCommerz session failed" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentId,
        paymentMethod: "sslcommerz",
      },
    });

    return {
      paymentId: result.tran_id,
      paymentUrl: result.GatewayPageURL,
      amount: Number(booking.totalPrice),
      currency: "BDT",
    };
  }

  // Handle payment callback (webhook)
  static async handlePaymentCallback(data: PaymentCallbackData) {
    const booking = await prisma.booking.findFirst({
      where: { paymentId: data.paymentId },
      include: {
        user: { select: { name: true, email: true } },
        boat: { select: { name: true } },
      },
    });

    if (!booking) {
      throw { status: 404, message: "Booking not found" };
    }

    if (data.status === "success") {
      // Update booking status to PAID
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "PAID" as any,
          transactionId: data.transactionId,
        },
      });

      // Send notifications and emails
      try {
        await NotificationService.createNotification(
          booking.userId,
          "Payment Successful",
          `Your payment for booking ${booking.id} has been confirmed.`
        );

        await emailService.sendBookingStatusUpdate(
          booking.user.email,
          booking.user.name,
          {
            bookingId: booking.id,
            boatName: booking.boat.name,
            status: "PAID" as any,
            message: "Your payment has been successfully processed.",
          }
        );
      } catch (error) {
        console.error("Failed to send notification/email:", error);
      }

      return { success: true, booking: updatedBooking };
    } else {
      // Payment failed
      await NotificationService.createNotification(
        booking.userId,
        "Payment Failed",
        `Your payment for booking ${booking.id} could not be processed. Please try again.`
      );

      return { success: false, message: "Payment failed" };
    }
  }

  // Verify payment status
  static async verifyPayment(paymentId: string) {
    const booking = await prisma.booking.findFirst({
      where: { paymentId },
      include: {
        user: { select: { name: true, email: true } },
        boat: { select: { name: true } },
      },
    });

    if (!booking) {
      throw { status: 404, message: "Payment not found" };
    }

    return {
      paymentId: booking.paymentId,
      paymentMethod: booking.paymentMethod,
      status: booking.status,
      amount: Number(booking.totalPrice),
      bookingId: booking.id,
    };
  }

  // Get payment history for user
  static async getPaymentHistory(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        paymentId: { not: null },
      },
      select: {
        id: true,
        paymentId: true,
        paymentMethod: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        boat: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  }
}
