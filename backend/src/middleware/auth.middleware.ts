import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { env } from "../config/env.js";

// Note: Run 'npm run prisma:generate' to generate Prisma client types
type Role = "CUSTOMER" | "MODERATOR" | "ADMIN";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }

    next();
  };
};
