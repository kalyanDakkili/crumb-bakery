# 🥐 Crumb — Online Bakery App

A full-stack online bakery built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Tech Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom bakery design system)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Custom JWT with httpOnly cookies + bcrypt
- **Deployment**: Vercel

## Features
- 🛍️ Product catalog with category filters and image cards
- 🛒 Shopping cart — add, remove, update quantities
- 💳 Checkout form — name, email, address, special instructions
- 👑 Admin panel — full CRUD for products + order management with status updates
- 🔐 Auth — customer & admin roles, secure JWT cookies
- 🗄️ Persistent DB — Supabase PostgreSQL for all data

---

## Quick Setup

### 1. Install
```bash
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. In SQL Editor, run `supabase-schema.sql` — creates tables + seeds 12 products + admin user
3. Copy your Project URL, anon key, and service_role key

### 3. Environment Variables
```bash
cp .env.example .env.local
```
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=some-long-random-secret
```

### 4. Run
```bash
npm run dev
```

---

## Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Add the 4 env vars
4. Deploy ✓

---

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@crumbbakery.com | Admin@123 |
| Customer | Register a new account | — |

---

## Architecture Decisions

**Custom JWT auth** — chose JWT + bcrypt over Supabase Auth for transparency and simplicity. The token is stored in an httpOnly cookie (XSS-safe) and verified server-side on every protected API call.

**Service role key for API routes** — all mutations go through server-side API routes using the Supabase service role key. RLS policies exist as a safety net but the architecture doesn't rely on client-side auth state for security.

**Cart in sessionStorage** — for a bakery app, a session-scoped cart is appropriate and avoids over-engineering. Items persist through the checkout flow and are cleared on order success.

**App Router + 'use client' only where needed** — layout and data-fetching components are server components by default; interactivity is isolated to leaf components.

**Playfair Display + DM Sans** — serif display font for warmth and character, clean sans-serif for UI text. Custom CSS variables for a consistent warm-brown bakery palette.
