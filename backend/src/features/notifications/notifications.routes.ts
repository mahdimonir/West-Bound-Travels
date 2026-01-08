import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { NotificationController } from "./notifications.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", NotificationController.getNotifications);
router.delete("/:id", NotificationController.deleteNotification);

export default router;
