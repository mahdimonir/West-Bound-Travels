import prisma from "../../config/database.js";
import { deleteImageByUrl, uploadImage } from "../../services/cloudinary.js";

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        role: true,
        preferences: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return user;
  }

  static async updateAvatar(
    userId: string,
    options: { imageLocalPath?: string; imageUrl?: string }
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw { status: 404, message: "User not found" };

    // Delete previous avatar if exists and new image is provided
    if ((options.imageLocalPath || options.imageUrl) && user.avatar) {
      await deleteImageByUrl(user.avatar);
    }

    let finalUrl: string | null = null;
    if (options.imageLocalPath) {
      const res: any = await uploadImage(
        options.imageLocalPath,
        "WBTravels/avatars"
      );
      finalUrl = res?.secure_url || null;
    } else if (options.imageUrl) {
      finalUrl = options.imageUrl;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { avatar: finalUrl },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  static async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; bio?: string; preferences?: any }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        role: true,
        preferences: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // Admin: Get all users with pagination
  static async getAllUsers(options?: {
    limit?: number;
    offset?: number;
    role?: string;
    search?: string;
  }) {
    const where: any = {};

    if (options?.role) {
      where.role = options.role;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { email: { contains: options.search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    const total = await prisma.user.count({ where });

    return {
      users,
      pagination: {
        total,
        limit: options?.limit,
        offset: options?.offset || 0,
      },
    };
  }

  // Admin: Update user role
  static async updateUserRole(userId: string, newRole: string) {
    const validRoles = ["CUSTOMER", "MODERATOR", "ADMIN"];
    if (!validRoles.includes(newRole)) {
      throw { status: 400, message: "Invalid role" };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  // Admin: Get all admins and moderators
  static async getAdmins() {
    return prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "MODERATOR"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
