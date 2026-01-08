type Role = "CUSTOMER" | "MODERATOR" | "ADMIN";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { uploadFields } from "../../middleware/upload.middleware.js";
import { UserController } from "./users.controller.js";

const router = Router();

// User routes (authenticated)
router.use(authenticate);
router.get("/me", UserController.getMe);
router.put("/me", UserController.updateMe);
router.post("/me/avatar", uploadFields, UserController.updateAvatar);

// Admin routes
router.get(
  "/admin/all",
  roleMiddleware(["ADMIN", "MODERATOR"] as Role[]),
  UserController.getAllUsers
);
router.get(
  "/admin/admins",
  roleMiddleware(["ADMIN"] as Role[]),
  UserController.getAdmins
);
router.patch(
  "/admin/:userId/role",
  roleMiddleware(["ADMIN"] as Role[]),
  UserController.updateUserRole
);

export default router;
