import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { paymentLimiter } from "../../middleware/rateLimit.middleware.js";
import { PaymentController } from "./payments.controller.js";

const router = Router();

// Payment callback (webhook - no auth required, but should verify signature in production)
// Payment callback (webhook - no auth required, but should verify signature in production)
router.post("/callback", PaymentController.callback);
router.post("/sslcommerz/success", PaymentController.sslSuccess);
router.post("/sslcommerz/fail", PaymentController.sslFail);
router.post("/sslcommerz/cancel", PaymentController.sslCancel);

// Payment initiation (authenticated with rate limiting)
router.use(authenticate);
router.post("/bkash/initiate", paymentLimiter, PaymentController.initiateBkash);
router.post(
  "/sslcommerz/initiate",
  paymentLimiter,
  PaymentController.initiateSSLCommerz
);
// Payment verification (authenticated)
router.get("/verify/:paymentId", PaymentController.verify);
router.get("/history", PaymentController.getHistory);

export default router;
