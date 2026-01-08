# West Bound Travels - Backend API

Complete RESTful API backend for West Bound Travels luxury houseboat booking system.

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START_GUIDE.md)** - Get started quickly
- **[Complete API Documentation](./API_DOCUMENTATION.md)** - All endpoints with examples
- **[Payment Integration Guide](./PAYMENT_INTEGRATION_GUIDE.md)** - bKash & SSLCommerz setup
- **[Notification & Email Guide](./NOTIFICATION_EMAIL_GUIDE.md)** - Email and notification system
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Database setup and migration

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Server runs on: `http://localhost:8000`  
API Docs: `http://localhost:8000/api-docs`

## ✨ Features

- ✅ User Authentication (JWT)
- ✅ Boat & Destination Management
- ✅ Booking System with Availability Check
- ✅ Payment Integration (bKash & SSLCommerz)
- ✅ Review System
- ✅ Notification System
- ✅ Email Service (SMTP)
- ✅ Static Page Management
- ✅ Admin Role Management
- ✅ Contact Form
- ✅ Rate Limiting & Security
- ✅ Swagger API Documentation

## 1. Technical Architecture

- **Runtime**: Node.js (Latest LTS)
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Email Service**: SendGrid / Mailgun / SMTP
- **File Storage**: Cloudinary (Recommended)

## 2. Shared Database Models (Schema Design)

### User Model

- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Hashed)
- `role`: Enum ['user', 'moderator', 'admin'] (Default: 'user')
- `phone`: String
- `bio`: String
- `preferences`: { `mealType`: String, `notificationsEnabled`: Boolean }
- `isVerified`: Boolean (Default: false)
- `otp`: { `code`: String, `expiresAt`: Date }

### Boat Model

- `name`: String (Required)
- `type`: Enum ['AC', 'Non-AC']
- `pricePerNight`: Number
- `totalRooms`: Number
- `features`: [String]
- `images`: [String]
- `isActive`: Boolean

### Booking Model

- `user`: ObjectId (Ref: User)
- `boat`: ObjectId (Ref: Boat)
- `checkIn`: Date
- `checkOut`: Date
- `guests`: Number
- `meals`: Number
- `totalAmount`: Number
- `status`: Enum ['Pending', 'Confirmed', 'Cancelled']

---

## 3. API Route Specification

### Authentication Module

| Method | Route            | Auth | Description          | Parameters              |
| :----- | :--------------- | :--- | :------------------- | :---------------------- |
| `POST` | `/auth/register` | No   | Create user account  | `email, name, password` |
| `POST` | `/auth/verify`   | No   | Verify email via OTP | `email, otpCode`        |
| `POST` | `/auth/login`    | No   | Sign in & return JWT | `email, password`       |
| `POST` | `/auth/recovery` | No   | Trigger reset email  | `email`                 |
| `POST` | `/auth/reset`    | No   | Set new password     | `token, password`       |

### Profile & User Activity

| Method | Route               | Auth | Description           | Parameters                |
| :----- | :------------------ | :--- | :-------------------- | :------------------------ |
| `GET`  | `/profile/me`       | JWT  | Get current user data | -                         |
| `PUT`  | `/profile/me`       | JWT  | Update personal info  | `name, phone, bio, prefs` |
| `POST` | `/profile/avatar`   | JWT  | Upload profile image  | `file`                    |
| `GET`  | `/profile/bookings` | JWT  | User's travel history | -                         |
| `GET`  | `/notifications`    | JWT  | Current unread alerts | -                         |

### Public & Booking Data

| Method | Route        | Auth | Description            | Parameters              |
| :----- | :----------- | :--- | :--------------------- | :---------------------- |
| `GET`  | `/boats`     | No   | Fetch all listed boats | `type (optional)`       |
| `GET`  | `/boats/:id` | No   | Single boat details    | -                       |
| `POST` | `/bookings`  | JWT  | Create new reservation | `boatId, dates, guests` |

### Administrative Module (Admin/Mod Only)

| Method | Route           | Auth  | Description           | Parameters            |
| :----- | :-------------- | :---- | :-------------------- | :-------------------- |
| `GET`  | `/admin/stats`  | Admin | Business metrics      | -                     |
| `POST` | `/blogs`        | Admin | Post new cruise story | `title, content, img` |
| `PUT`  | `/static/:slug` | Admin | Edit FAQ/Privacy, etc | `content`             |
| `POST` | `/gallery`      | Admin | Add photography       | `file`                |

## 4. Business Logic Requirements

1. **Security**: All passwords MUST be hashed using `bcrypt` or `argon2`.
2. **Booking Validation**: Ensure the boat has available rooms for the selected dates before confirming a booking.
3. **Meal Logic**: Backend should re-calculate `(days * 2 + nights * 1)` upon submission to verify the price calculated by the frontend.
4. **Notifications**:
   - Trigger an in-app `Notification` record on every lifecycle event.
   - Trigger an external `SMTP` mailer for high-priority events (New Booking, Verify Account).

## 5. Development Milestones

1. **Phase 1**: DB Connection & Auth Boilerplate (JWT + OTP).
2. **Phase 2**: Boat & Booking CRUD + Logic.
3. **Phase 3**: Content Management APIs (Blogs, Static Content).
4. **Phase 4**: Notification Hub & Email Integration.
