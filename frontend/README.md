# West Bound Travels - Frontend

Welcome to the frontend repository for **West Bound Travels**, a luxury houseboat travel service operating in the stunning wetlands of Sunamganj, Bangladesh (Tanguar Haor and surrounding areas).

This Next.js application provides a fully responsive, modern booking platform showcasing 4 premium houseboats, detailed room configurations, destination highlights, food menus, galleries, blogs, and a complete booking engine.

## 🚀 Live Demo
https://west-bound-travels.vercel.app

## 🌟 Key Features

- **Luxury Visual Experience**: Rich image galleries featuring boat exteriors, golden-themed luxury interiors, premium food menus, and scenic destinations.
- **Smart Booking Engine**:
  - Minimum 2 days / 1 night package
  - Selection of 5 out of 7 iconic destinations per trip
  - 5 premium meals included (breakfast, lunch, evening snacks, dinner, barbecue)
  - Real-time availability calendar (integrated with backend)
  - Room selection with detailed capacity (AC balcony rooms, couple rooms, family rooms)
- **User Authentication**: Register/Login required for bookings, profile management, and booking history
- **User Dashboard**: View past/upcoming bookings, manage profile, preferences (meal type, notifications)
- **Admin Panel** (protected routes): Manage boats, destinations, blogs, gallery, and static content
- **Responsive Design**: Mobile-first, optimized for travelers browsing on phones
- **SEO Optimized**: Dynamic meta tags, OpenGraph support for blogs and boats

## 🛥️ Our Fleet (4 Houseboats)

### AC Houseboats
1. **The Captain House Boat**
2. **Hoarer Sultan House Boat**

### Non-AC Houseboats
1. **Jul Nibash I**
2. **Jul Nibash II**

**All boats feature identical luxury room configuration (7 rooms total):**
- 4 × AC Rooms with Balcony & Attached Bath (max 4 persons each)
- 1 × Couple Room with Attached Bath (max 2 persons)
- 1 × Couple Room (shared bath, max 2 persons)
- 1 × Family Room (2 beds, attached bath, max 6 persons)

Golden luxury theme throughout interiors.

## 🗺️ Destinations (Select 5 per trip)

1. Tanguar Haor
2. Watch Tower
3. Niladri Lake
4. Shimul Bagan
5. Barikka Tila
6. Zadukatha Nodi (Jadukata River)
7. Lakma Choda

## 🍽️ Food & Dining

- 5 premium meals included in every package
- High-quality Bengali & continental cuisine
- Special dietary options available on request

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer (Auth, Booking, Notifications)
- **UI Components**: Custom + Headless UI / Radix where needed
- **Forms**: React Hook Form + Zod validation
- **Calendar**: React Datepicker / FullCalendar integration
- **Authentication**: JWT-based (stored in httpOnly cookies or secure context)
- **Image Optimization**: Next.js Image component + Cloudinary
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Register, Forgot Password
│   ├── booking/            # Multi-step booking flow
│   ├── dashboard/          # Admin panel (protected)
│   ├── profile/            # User dashboard
│   ├── boats/              # Fleet details
│   ├── destinations/
│   ├── gallery/
│   ├── blog/
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
│   ├── ui/                 # Buttons, Cards, Modals
│   ├── layout/             # Header, Footer, Navbar
│   ├── booking/            # Calendar, RoomSelector, etc.
│   └── shared/
├── context/                # AuthContext, BookingContext
├── lib/                    # Utilities, API helpers
├── public/                 # Static assets (logos, placeholders)
├── styles/                 # Global CSS + Tailwind config
└── types/                  # TypeScript interfaces
```

## 🎨 Design System

- **Primary Color**: Orange (#FF6600) – Energy, adventure
- **Secondary**: Aqua Blue (#00BFFF) – Water, serenity
- **Accent**: Forest Green (#228B22) – Nature
- **Luxury Highlight**: Gold (#D4AF37) – Used extensively for boat/room elements to emphasize premium feel

## 🔌 API Integration

Base URL configured via environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.westboundtravels.com/api/v1
# or localhost during development
```

Key endpoints consumed:
- `GET /boats` → Fleet listing
- `GET /destinations` → Tour locations
- `POST /auth/register & /login`
- `POST /bookings` → Create reservation (with availability check)
- `GET /users/me/bookings` → History
- Admin CRUD routes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/mahdimonir/West-Bound-Travels.git
cd West-Bound-Travels/frontend
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# For production:
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px

Fully optimized for mobile booking experience.

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary for West Bound Travels.

## 📞 Contact & Support

For issues, suggestions, or support:
- Email: mahdimoniruzzaman@gmail.com
- Phone: +8801876689921

---

**Explore the waters in luxury with West Bound Travels** 🛥️✨