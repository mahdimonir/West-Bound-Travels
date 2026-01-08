# West Bound Travels 🛥️✨

![West Bound Travels Banner](https://via.placeholder.com/1200x600/FF6600/FFFFFF?text=West+Bound+Travels+-+Luxury+Houseboat+Adventures)  
*Luxury houseboat experiences in the serene wetlands of Sunamganj, Bangladesh*

**West Bound Travels** is a premium tourism platform specializing in exclusive houseboat journeys through Tanguar Haor and surrounding destinations. This full-stack application delivers a seamless, elegant booking experience for travelers and powerful management tools for administrators.

![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2E3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-32CD32?logo=node.js&logoColor=white)
![SSLCommerz](https://img.shields.io/badge/Payment-SSLCommerz-orange)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)

## 🌟 Key Features

- **Luxury Fleet Showcase** — 4 premium houseboats with golden-themed interiors and detailed room configurations
- **Real-Time Booking Engine** — Concurrent-safe availability checks powered by PostgreSQL transactions
- **Secure Payments** — Full SSLCommerz integration (Cards, bKash, Nagad, Rocket) with sandbox/live support
- **Email Verification** — OTP-based registration to prevent fake accounts
- **User Dashboard** — Profile management, booking history, and invoice downloads
- **Admin Panel** — Comprehensive control over boats, destinations, bookings, blogs, gallery, and static content
- **Content Management** — Editable static pages (About, Privacy, Terms, FAQ) and Markdown blog system
- **Automated Emails** — Professional notifications for registration, bookings, and password resets
- **Responsive Luxury Design** — Mobile-first, elegant UI with Tailwind CSS

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/1200x800/00BFFF/FFFFFF?text=Home+Page+-+Hero+with+Boat+Gallery)

### Boat Details & Booking
![Boat Details](https://via.placeholder.com/1200x800/228B22/FFFFFF?text=Boat+Details+-+Rooms%2C+Gallery%2C+Calendar)

### Booking Flow
![Booking Process](https://via.placeholder.com/1200x800/FF6600/FFFFFF?text=Multi-Step+Booking+-+Dates%2C+Rooms%2C+Payment)

### User Dashboard
![User Dashboard](https://via.placeholder.com/1200x800/D4AF37/FFFFFF?text=User+Dashboard+-+Bookings+%26+Profile)

### Admin Panel
![Admin Panel](https://via.placeholder.com/1200x800/4B0082/FFFFFF?text=Admin+Dashboard+-+Fleet+%26+Content+Management)

> *Note: Replace placeholder images with actual screenshots after deployment.*

## 🛠️ Technology Stack

### Frontend
- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **Data Fetching** — React Query + SWR
- **Icons** — Lucide React
- **Forms & Editor** — React Hook Form, React Quill

### Backend
- **Runtime** — Node.js (LTS)
- **Framework** — Express.js
- **Database** — PostgreSQL
- **ORM** — Prisma (v7+ with driver adapter)
- **Validation** — Zod
- **Authentication** — JWT + OTP verification
- **Logging** — Pino
- **Image Management** — Cloudinary
- **Email** — Nodemailer (SMTP)

## 📋 Prerequisites

- Node.js ≥ 18
- PostgreSQL (local or cloud: Neon, Supabase, Railway)
- Git

## ⚙️ Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env    # Configure your secrets
npx prisma generate
npx prisma migrate dev
npm run dev             # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

## 🚀 Deployment

- **Frontend** — Vercel (recommended)
- **Backend** — Railway, Render, or any Node.js-compatible host

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## 📜 License

Licensed under the **ISC License**.

---

**West Bound Travels** — *Where luxury meets the waters of Bangladesh*  
Crafted with passion for unforgettable journeys 🌊✨