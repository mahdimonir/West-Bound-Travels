import { Router } from "express";
import { contactLimiter } from "../../middleware/rateLimit.middleware.js";
import { ContactController } from "./contact.controller.js";

const router = Router();

// Public route with rate limiting
router.post(
  "/",
  contactLimiter,
  ContactController.submitForm.bind(ContactController)
);

export default router;
