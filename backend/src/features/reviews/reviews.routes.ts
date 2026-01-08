import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { ReviewController } from "./reviews.controller.js";

const router = Router();

// Public: Get reviews by boat
router.get("/boat/:boatId", ReviewController.getByBoat.bind(ReviewController));

// Protected routes
router.use(authenticate);
// User routes (authenticated)
router.post("/", ReviewController.create.bind(ReviewController));
router.get("/me", ReviewController.getMyReviews.bind(ReviewController));
router.put("/:id", ReviewController.update.bind(ReviewController));
router.delete("/:id", ReviewController.delete.bind(ReviewController));

// Admin routes
router.get(
  "/admin/all",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  ReviewController.getAll.bind(ReviewController)
);
router.patch(
  "/admin/:id/status",
  roleMiddleware(["ADMIN", "MODERATOR"]),
  ReviewController.updateStatus.bind(ReviewController)
);

export default router;
