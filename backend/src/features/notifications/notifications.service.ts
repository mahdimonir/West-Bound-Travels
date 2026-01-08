import prisma from "../../config/database.js";

export class NotificationService {
  static async getUnreadNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createNotification(
    userId: string,
    title: string,
    message: string
  ) {
    // Check user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    const preferences = user?.preferences as any;
    if (preferences?.notifications === false) {
      return null;
    }

    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });
  }

  static async deleteNotification(userId: string, id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) throw { status: 404, message: "Notification not found" };
    if (notification.userId !== userId)
      throw { status: 403, message: "Forbidden" };
    return prisma.notification.delete({ where: { id } });
  }
}
