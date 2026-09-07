# CollegeDiscovery

A production-grade college discovery and decision-making platform built with Next.js 15, React 18, TypeScript, TailwindCSS, PostgreSQL, and Prisma ORM.

## Features

- **College Listing + Search** — Full-text search with filters (state, type, ownership, fees range, min rating), sorting, and pagination
- **College Detail Page** — Tabbed UI with Overview, Courses table, Placement stats, and Student Reviews
- **Compare Colleges** — Side-by-side comparison of up to 3 colleges with winner highlighting (fees, packages, placement rate, NIRF rank, facilities checklist)
- **Authentication** — Email/password signup & login with NextAuth.js (JWT sessions)
- **Saved Colleges** — Bookmark colleges to a personal shortlist, filter within saved list

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 15 (App Router), React 18, TypeScript |
| Styling    | TailwindCSS, Lucide Icons           |
| Auth       | NextAuth.js v4 (Credentials)        |
| Database   | PostgreSQL (Neon recommended)       |
| ORM        | Prisma 5                            |
| Deployment | Vercel (frontend) + Neon (DB)       |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd college-discovery
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
- `DATABASE_URL` — your PostgreSQL connection string (get from [neon.tech](https://neon.tech))
- `NEXTAUTH_SECRET` — generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo account

After seeding, log in with:
- **Email:** `demo@collegediscovery.in`
- **Password:** `demo@1234`

## Project Structure

```
college-discovery/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth + register
│   │   ├── colleges/      # List, detail, compare
│   │   ├── saved/         # Save/unsave toggle
│   │   └── reviews/       # Submit reviews
│   ├── colleges/          # /colleges listing + /colleges/[slug]
│   ├── compare/           # Compare page
│   ├── saved/             # Saved shortlist (protected)
│   ├── auth/              # Login + register pages
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Button, Card, Badge, Input, Select, Modal, Skeleton, StarRating
│   ├── layout/            # Navbar, Footer
│   ├── colleges/          # CollegeCard, CollegeFiltersPanel, CollegeDetailView, etc.
│   ├── compare/           # CompareTable, CollegeSearchPicker
│   ├── saved/             # SavedCollegesView
│   └── auth/              # LoginForm, RegisterForm
├── context/
│   └── CompareContext.tsx # Global compare state (up to 3 colleges)
├── lib/
│   ├── prisma.ts          # Singleton Prisma client
│   ├── auth.ts            # NextAuth options
│   ├── types.ts           # Shared TypeScript interfaces
│   └── utils.ts           # cn, formatFees, formatPackage, etc.
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # 12 realistic Indian colleges
```

## Deployment

### Vercel + Neon

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Run `npx prisma db push` and `npm run db:seed` against your Neon DB once

## Seed Data

12 colleges seeded including IIT Bombay, IIT Delhi, IIT Madras, BITS Pilani, IIM Ahmedabad, AIIMS Delhi, NLS Bangalore, VIT, Manipal, Delhi University, Jadavpur University, and Symbiosis — each with courses, placement stats, facilities, and a sample review.
