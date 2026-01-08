// Note: Run 'npm run prisma:generate' to generate Prisma client types
type Role = "CUSTOMER" | "MODERATOR" | "ADMIN";
import { NextFunction, Request, Response } from "express";

export const roleMiddleware = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }
    next();
  };
};
