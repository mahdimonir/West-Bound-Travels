import { NextFunction, Request, Response } from "express";
import { UserService } from "./users.service.js";

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id; // Middleware ensures user exists
      const user = await UserService.getProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { name, phone, bio, preferences } = req.body;

      const updatedUser = await UserService.updateProfile(userId, {
        name,
        phone,
        bio,
        preferences,
      });

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async updateAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const file = files?.avatar?.[0];
      const imageLocalPath = file?.path;

      if (!imageLocalPath)
        return res
          .status(400)
          .json({ success: false, message: "Image file is required" });
      const updated = await UserService.updateAvatar(userId, {
        imageLocalPath,
      });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  // Admin routes
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;
      const role = req.query.role as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await UserService.getAllUsers({
        limit,
        offset,
        role,
        search,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res
          .status(400)
          .json({ success: false, message: "Role is required" });
      }

      const updatedUser = await UserService.updateUserRole(userId, role);
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await UserService.getAdmins();
      res.json({ success: true, data: admins });
    } catch (error) {
      next(error);
    }
  }
}
