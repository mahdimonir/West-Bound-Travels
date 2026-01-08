import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import { PaymentService } from "./payments.service.js";
import { paymentCallbackSchema } from "./payments.validation.js";

export class PaymentController {
  static async initiateBkash(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { bookingId } = req.body;

      if (!bookingId) {
        return res
          .status(400)
          .json({ success: false, message: "Booking ID is required" });
      }

      const payment = await PaymentService.initiateBkashPayment(
        bookingId,
        userId
      );
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  static async initiateSSLCommerz(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const { bookingId } = req.body;

      if (!bookingId) {
        return res
          .status(400)
          .json({ success: false, message: "Booking ID is required" });
      }

      const payment = await PaymentService.initiateSSLCommerzPayment(
        bookingId,
        userId
      );
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  static async sslSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      // SSLCommerz sends data in body
      const { tran_id, val_id } = req.body;
      const { booking_id } = req.query; // We passed this in the URL

      if (!tran_id || !booking_id) {
        throw { status: 400, message: "Invalid payment data" };
      }

      // Update booking status
      await PaymentService.handlePaymentCallback({
        paymentId: tran_id,
        status: "success",
        transactionId: val_id || tran_id
      });
      
      // Redirect to frontend success page
      res.redirect(`${env.FRONTEND_URL}/payment/success?booking_id=${booking_id}&tran_id=${tran_id}`);
    } catch (error) {
      console.error("SSL Success Error:", error);
      const { booking_id } = req.query;
      res.redirect(`${env.FRONTEND_URL}/payment/fail?booking_id=${booking_id}&error=processing_failed`);
    }
  }

  static async sslFail(req: Request, res: Response, next: NextFunction) {
    const { booking_id } = req.query;
    res.redirect(`${env.FRONTEND_URL}/payment/fail?booking_id=${booking_id}`);
  }

  static async sslCancel(req: Request, res: Response, next: NextFunction) {
    const { booking_id } = req.query;
    res.redirect(`${env.FRONTEND_URL}/payment/cancel?booking_id=${booking_id}`);
  }

  static async callback(req: Request, res: Response, next: NextFunction) {
    try {
      // This endpoint should be called by payment gateway webhook
      // In production, verify the webhook signature
      const validatedData = paymentCallbackSchema.parse(req.body);

      const result = await PaymentService.handlePaymentCallback(validatedData);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      const payment = await PaymentService.verifyPayment(paymentId);
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const history = await PaymentService.getPaymentHistory(userId);
      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }
}
