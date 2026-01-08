import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { CACHE_DURATION, cacheMiddleware } from "../../middleware/cache.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { uploadFields } from "../../middleware/upload.middleware.js";
import { BoatController } from "./boats.controller.js";

const router = Router();

router.get("/", cacheMiddleware(CACHE_DURATION.boats), BoatController.getBoats);
router.get("/:id", cacheMiddleware(CACHE_DURATION.boats), BoatController.getBoat);
router.get("/:id/availability", cacheMiddleware(CACHE_DURATION.availability), BoatController.checkAvailability);
router.post(
  "/",
  authenticate,
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  BoatController.createBoat
);
router.put(
  "/:id",
  authenticate,
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  BoatController.updateBoat
);
router.delete(
  "/:id",
  authenticate,
  roleMiddleware(["ADMIN"]),
  BoatController.deleteBoat
);

export default router;
