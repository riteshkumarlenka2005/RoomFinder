# 🏠 Room Finder Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A modern, full-stack, and responsive web application designed to help users discover rooms, PG accommodations, and rental apartments effortlessly. It also bridges the gap between property owners, tenants, and domestic helpers (Maushi Services) with intuitive dashboards, streamlined listing management, and Google OAuth integration.

---

## 🌟 Key Features

### 🔍 For Tenants & Searchers
- **Smart Search & Filters**: Easily filter properties by location, type (PG, Apartment, Room), price range, amenities, and occupancy.
- **Rich Property Details**: High-resolution image galleries, verified amenities, location info, and transparent pricing.
- **Domestic Helpers (Maushi Services)**: Find, evaluate, and hire verified housemaids, cooks, and caretakers categorized by skill, location, and rating.
- **Direct Owner Inquiries**: Message landlords and schedule visits directly from the platform.
- **Fully Responsive UI**: Mobile-first design that adapts seamlessly from handheld smartphones to ultra-wide desktop monitors.

### 🏢 For Property Owners
- **Owner Dashboard**: An all-in-one control center to oversee listings, inquiries, and earnings.
- **Listing Management**: Add, update, pause, or remove property listings with multi-image upload and amenity configuration.
- **Analytics & Insights**: Track key performance metrics including total property views, active inquiries, and occupancy rates with interactive charts.
- **Booking & Inquiry Tracking**: Manage pending, confirmed, and past tenant requests in real time.
- **Direct Messaging Inbox**: Chat directly with interested tenants to close deals faster.

### 🔐 Authentication & Security
- **Google OAuth Integration**: One-click sign-in and sign-up with differentiated user onboarding flows.
- **Role-based Experience**: Tailored views and permissions for tenants vs. property owners.
- **Secure Sessions**: Powered by Supabase Auth with server-side and client-side session validation.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Actions) |
| **Frontend Library** | [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) (Radix UI Primitives) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) validation |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```text
RoomFinder/
├── app/                  # Next.js App Router (pages, api routes, layout)
│   ├── auth/             # Authentication & OAuth callback handlers
│   ├── dashboard/        # Owner & Tenant dashboard views
│   ├── properties/       # Property listings & detailed view pages
│   └── services/         # Domestic helper (Maushi) services
├── components/           # Reusable UI & business components
│   ├── ui/               # Radix UI / Shadcn base components
│   ├── forms/            # Listing and profile forms
│   └── navigation/       # Navbar, footer, and sidebar navigation
├── hooks/                # Custom React hooks (auth, media queries, etc.)
├── lib/                  # Utility functions, Supabase & Prisma clients
├── prisma/               # Prisma schema & migration files
├── public/               # Static assets & icons
└── styles/               # Global CSS & Tailwind configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.18.0 or later recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/riteshkumarlenka2005/RoomFinder.git
   cd RoomFinder
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Database Connection (if using Prisma with Supabase / PostgreSQL)
   DATABASE_URL=your_postgresql_database_connection_string
   DIRECT_URL=your_postgresql_direct_connection_string
   ```

4. **Initialize Database (if applicable):**
   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Deployment

This project is optimized for fast and easy deployment on [Vercel](https://vercel.com/):

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Set your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`).
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js application.

---

## 👤 Author

- **Ritesh Kumar Lenka** - [@riteshkumarlenka2005](https://github.com/riteshkumarlenka2005)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.