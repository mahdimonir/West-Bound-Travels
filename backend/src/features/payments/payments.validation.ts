import { z } from "zod";

export const initiatePaymentSchema = z.object({
  bookingId: z.string().cuid(),
  paymentMethod: z.enum(["bkash", "sslcommerz"]),
});

export const paymentCallbackSchema = z.object({
  paymentId: z.string(),
  status: z.enum(["success", "failed"]),
  transactionId: z.string().optional(),
  amount: z.number().optional(),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type PaymentCallbackInput = z.infer<typeof paymentCallbackSchema>;
