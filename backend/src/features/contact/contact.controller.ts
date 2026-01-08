import { NextFunction, Request, Response } from "express";
import prisma from "../../config/database.js";
import { env } from "../../config/env.js";
import { emailService } from "../../services/email.service.js";
import { NotificationService } from "../notifications/notifications.service.js";
import { contactFormSchema } from "./contact.validation.js";

export class ContactController {
  static async submitForm(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = contactFormSchema.parse(req.body);

      // Get admin emails
      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { email: true, id: true },
      });

      const adminEmails = admins.map(
        (admin: { email: string; id: string }) => admin.email
      );

      // If ADMIN_EMAIL is set in env, add it
      if (env.ADMIN_EMAIL && !adminEmails.includes(env.ADMIN_EMAIL)) {
        adminEmails.push(env.ADMIN_EMAIL);
      }

      // Send email to admins
      if (adminEmails.length > 0) {
        await emailService.sendContactFormNotification(adminEmails, {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          subject: validatedData.subject,
          message: validatedData.message,
        });
      }

      // Send notification to all admins
      for (const admin of admins as any[]) {
        await NotificationService.createNotification(
          admin.id,
          "New Contact Form Submission",
          `New message from ${validatedData.name} (${validatedData.email})`
        );
      }

      res.status(200).json({
        success: true,
        message:
          "Your message has been sent successfully. We will get back to you soon!",
      });
    } catch (error) {
      next(error);
    }
  }
}
