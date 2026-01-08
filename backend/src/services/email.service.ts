import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import logger from "../utils/logger.js";

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Initialize transporter if SMTP config is available
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        ...(env.SMTP_SERVICE && { service: env.SMTP_SERVICE }),
      });
    } else {
      logger.warn("Email service not configured: SMTP credentials missing");
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn("Email service not configured, skipping email send");
      return false;
    }

    try {
      const mailOptions = {
        from: `"West Bound Travels" <${env.SMTP_USER}>`,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error({ error }, "Failed to send email");
      return false;
    }
  }

  // Registration opt email
  async sendRegistrationOTP(email: string, name: string, otp: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2>Welcome to West Bound Travels, ${name}!</h2>
      <p>Your verification code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px; color: #FF6600;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

    return this.sendEmail({
      to: email,
      subject: "Verify Your Email - West Bound Travels",
      html,
    });
  }

  // Password Reset opt emil
  async sendPasswordResetOTP(email: string, name: string, otp: string) {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>Use this code to reset your password:</p>
      <h1 style="font-size: 32px; letter-spacing: 8px; color: #FF6600;">${otp}</h1>
      <p>Valid for 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;

    return this.sendEmail({
      to: email,
      subject: "Reset Your Password - West Bound Travels",
      html,
    });
  }

  // Booking confirmation email
  async sendBookingConfirmation(
    userEmail: string,
    userName: string,
    bookingDetails: {
      bookingId: string;
      boatName: string;
      startDate: string;
      endDate: string;
      totalPrice: number;
      status: string;
    }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Booking Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>Your booking has been confirmed!</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Booking Details:</h3>
              <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
              <p><strong>Boat:</strong> ${bookingDetails.boatName}</p>
              <p><strong>Check-in:</strong> ${new Date(
                bookingDetails.startDate
              ).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(
                bookingDetails.endDate
              ).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> ৳${bookingDetails.totalPrice.toLocaleString()}</p>
              <p><strong>Status:</strong> ${bookingDetails.status}</p>
            </div>
            <p>Thank you for choosing West Bound Travels!</p>
            <p>Best regards,<br>West Bound Travels Team</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: "Booking Confirmation - West Bound Travels",
      html,
    });
  }

  // Contact form notification (to admin)
  async sendContactFormNotification(
    adminEmails: string[],
    contactDetails: {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
    }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${contactDetails.name}</p>
              <p><strong>Email:</strong> ${contactDetails.email}</p>
              ${
                contactDetails.phone
                  ? `<p><strong>Phone:</strong> ${contactDetails.phone}</p>`
                  : ""
              }
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${contactDetails.message}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: adminEmails,
      subject:
        contactDetails.subject ||
        "New Contact Form Submission - West Bound Travels",
      html,
    });
  }

  // Booking status update notification
  async sendBookingStatusUpdate(
    userEmail: string,
    userName: string,
    bookingDetails: {
      bookingId: string;
      boatName: string;
      status: string;
      message?: string;
    }
  ): Promise<boolean> {
    const statusMessages: Record<string, string> = {
      CONFIRMED: "Your booking has been confirmed!",
      PAID: "Payment received! Your booking is now confirmed.",
      CANCELLED: "Your booking has been cancelled.",
      REFUNDED: "Your booking has been refunded.",
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Status Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Booking Status Update</h2>
            <p>Dear ${userName},</p>
            <p>${
              statusMessages[bookingDetails.status] ||
              "Your booking status has been updated."
            }</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
              <p><strong>Boat:</strong> ${bookingDetails.boatName}</p>
              <p><strong>Status:</strong> ${bookingDetails.status}</p>
              ${
                bookingDetails.message
                  ? `<p><strong>Message:</strong> ${bookingDetails.message}</p>`
                  : ""
              }
            </div>
            <p>Thank you for choosing West Bound Travels!</p>
            <p>Best regards,<br>West Bound Travels Team</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Booking Status Update - ${bookingDetails.status} - West Bound Travels`,
      html,
    });
  }
}

export const emailService = new EmailService();
