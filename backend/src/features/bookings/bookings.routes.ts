import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { BookingController } from "./bookings.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", BookingController.create);
router.get("/availability", BookingController.checkAvailability);
router.get("/my", BookingController.getMyBookings);
router.get("/:id", BookingController.getBooking);

// Admin routes
router.get(
  "/admin/all",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  BookingController.getAllBookings
);
router.patch(
  "/admin/:id/status",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  BookingController.updateBookingStatus
);

export default router;
