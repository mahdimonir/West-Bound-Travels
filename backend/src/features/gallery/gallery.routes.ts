import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { uploadFields } from "../../middleware/upload.middleware.js";
import { GalleryController } from "./gallery.controller.js";

const router = Router();

// public list
router.get("/", GalleryController.list);

// protected create/delete (admin)
router.use(authenticate);
router.post(
  "/",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  uploadFields,
  GalleryController.create
);
router.delete(
  "/:id",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  GalleryController.remove
);

export default router;
