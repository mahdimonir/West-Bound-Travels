import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { SettingsController } from "./settings.controller.js";

const router = Router();

// Public endpoint to get minimum booking nights (for booking page)
router.get("/min-nights", async (req, res, next) => {
  try {
    const { SettingsService } = await import("./settings.service.js");
    const minNights = await SettingsService.getMinBookingNights();
    res.json({ success: true, data: { minNights } });
  } catch (error) {
    next(error);
  }
});

// Admin only routes
router.get("/", authenticate, roleMiddleware(["ADMIN"]), SettingsController.getAll);
router.get("/:key", authenticate, roleMiddleware(["ADMIN"]), SettingsController.getByKey);
router.put("/:key", authenticate, roleMiddleware(["ADMIN"]), SettingsController.update);
router.put("/booking/min-nights", authenticate, roleMiddleware(["ADMIN"]), SettingsController.updateMinNights);
router.post("/initialize", authenticate, roleMiddleware(["ADMIN"]), SettingsController.initializeDefaults);

export default router;
