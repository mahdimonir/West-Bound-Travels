import { NextFunction, Request, Response } from "express";
import { NotificationService } from "./notifications.service.js";

export class NotificationController {
  static async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const notifications = await NotificationService.getUnreadNotifications(
        userId
      );
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await NotificationService.deleteNotification(userId, id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
