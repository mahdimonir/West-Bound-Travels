import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { uploadFields } from "../../middleware/upload.middleware.js";
import { BlogController } from "./blog.controller.js";

const router = Router();

// Public routes
router.get("/published", BlogController.getPublished);
router.get("/:slug", BlogController.getBySlug);

// Protected Admin routes
router.use(authenticate);
router.get("/", roleMiddleware(["ADMIN", "MODERATOR"]), BlogController.getAll);
router.post(
  "/",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  BlogController.create
);
router.patch(
  "/:id",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  BlogController.update
);
router.delete(
  "/:id",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  BlogController.delete
);
router.patch(
  "/:id/status",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  BlogController.updateStatus
);

export default router;
