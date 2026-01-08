import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { uploadFields } from "../../middleware/upload.middleware.js";
import { DestinationController } from "./destinations.controller.js";

const router = Router();

// Public
router.get("/", DestinationController.getDestinations);
router.get("/:id", DestinationController.getDestination);

// Protected - admin only for create/update/delete
router.use(authenticate);
router.post(
  "/",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  DestinationController.createDestination
);
router.put(
  "/:id",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  DestinationController.updateDestination
);
router.delete(
  "/:id",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  DestinationController.deleteDestination
);

export default router;
