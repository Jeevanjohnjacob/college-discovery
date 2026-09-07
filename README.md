# 🎓 CollegeDiscovery

A full-stack college discovery platform that helps students **search, explore, compare, and shortlist colleges across India**.

Built as a production-oriented MVP using Next.js, TypeScript, TailwindCSS, Prisma, PostgreSQL, and NextAuth.js.

## 🚀 Live Demo

**Live Application:**  
https://college-discovery-silk.vercel.app

**GitHub Repository:**  
https://github.com/Jeevanjohnjacob/college-discovery

---

## ✨ Features

### 🔎 1. College Listing & Search

- Search colleges by name and relevant information
- Filter colleges by:
  - State
  - Institution type
  - Ownership
  - Fees
  - Minimum rating
- Sorting support
- Pagination
- Responsive college cards
- Empty-state handling

### 🏫 2. College Details

Each college has a dedicated detail page containing:

- College overview
- Courses offered
- Fee information
- Placement statistics
- Student reviews
- Facilities
- College-specific information

### ⚖️ 3. Compare Colleges

Compare up to **3 colleges side-by-side**.

Comparison includes:

- Fees
- Placement packages
- Placement rate
- NIRF ranking
- Facilities
- Winner highlighting for important metrics

The comparison state is maintained across navigation using a shared React context.

### 🔐 4. Authentication & Saved Colleges

- User registration
- Email/password login
- NextAuth.js authentication
- JWT-based sessions
- Protected saved-college functionality
- Save/unsave colleges
- Personal shortlist of saved colleges

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 18, TypeScript |
| Styling | TailwindCSS |
| Icons | Lucide Icons |
| Backend | Next.js API Routes |
| Authentication | NextAuth.js v4 |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Deployment | Vercel |

---

## 🏗️ Architecture

The application follows a full-stack Next.js architecture.

```text
                    ┌──────────────────────┐
                    │      User / UI       │
                    │ Next.js + React + TS │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js App Router │
                    │     Pages / UI       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    API Routes        │
                    │ Colleges / Auth /    │
                    │ Saved / Reviews      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Prisma         │
                    │         ORM          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   PostgreSQL / Neon  │
                    └──────────────────────┘

                    Authentication
                    ───────────────
                       NextAuth.js
                           │
                           ▼
                     JWT Sessions

📁 Project Structure

college-discovery/
│
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication & registration
│   │   ├── colleges/          # College APIs
│   │   ├── saved/             # Save / unsave colleges
│   │   └── reviews/           # Review APIs
│   │
│   ├── colleges/
│   │   ├── page.tsx           # College listing
│   │   └── [slug]/            # College detail page
│   │
│   ├── compare/               # College comparison
│   ├── saved/                 # Saved colleges
│   ├── auth/                  # Login & registration
│   └── page.tsx               # Homepage
│
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── layout/                # Navbar & Footer
│   ├── colleges/              # College components
│   ├── compare/               # Comparison components
│   ├── saved/                 # Saved college components
│   └── auth/                  # Authentication components
│
├── context/
│   └── CompareContext.tsx     # Global comparison state
│
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # NextAuth configuration
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts               # Utility functions
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
│
├── public/                    # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── vercel.json


🗄️ Database

The application uses PostgreSQL with Prisma ORM.

The database contains relational data for:

Users
Colleges
Courses
Reviews
Saved colleges

The Prisma schema provides a structured relationship between colleges, courses, reviews, and authenticated users.

The development database is hosted using Neon PostgreSQL.

🔑 Environment Variables

Create a .env.local file:

DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

For production, these variables are configured securely through Vercel Environment Variables.

Never commit .env or .env.local to Git.

⚙️ Getting Started
1. Clone the repository
git clone https://github.com/Jeevanjohnjacob/college-discovery.git
cd college-discovery
2. Install dependencies
npm install
3. Configure environment variables

Create .env.local with:

DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
4. Generate Prisma Client
npx prisma generate
5. Push the database schema
npx prisma db push
6. Seed the database
npm run db:seed
7. Start the development server
npm run dev

Open:

http://localhost:3000
🧪 Key User Flows
Discover
Homepage
   ↓
Search / Filter
   ↓
College Listing
   ↓
College Details
Compare
College Listing
   ↓
Select Colleges
   ↓
Compare
   ↓
Side-by-Side Comparison
Save
College Details
   ↓
Sign In
   ↓
Save College
   ↓
Saved Colleges
🛡️ Edge Cases Considered

The application handles common user scenarios including:

Empty search results
Invalid college routes
Empty saved-college lists
Authentication-required actions
Invalid login credentials
College comparison limits
Missing or incomplete college information
Responsive layouts across screen sizes
🎯 Design Decisions & Tradeoffs
Next.js App Router

Next.js provides both the frontend and backend API layer in a single application, reducing unnecessary infrastructure for an MVP.

Prisma

Prisma provides type-safe database access and makes the PostgreSQL data model easier to maintain.

PostgreSQL

A relational database is suitable because colleges, courses, reviews, users, and saved colleges have clear relationships.

NextAuth.js

NextAuth provides session management and authentication without requiring a separate authentication backend.

Neon + Vercel

Neon provides managed PostgreSQL while Vercel provides convenient deployment for the Next.js application.

📊 Seed Data

The project includes realistic seed data for Indian colleges with information such as:

College details
Courses
Fees
Placement statistics
Facilities
Rankings
Student reviews

This allows the application to demonstrate its complete functionality immediately after setup.

🔮 Future Improvements

Potential future enhancements include:

College recommendation / predictor system
AI-powered college Q&A
More advanced ranking and filtering
User profile customization
More detailed placement analytics
College admission deadline tracking
Mobile-first improvements
Automated testing and CI/CD
👨‍💻 Project

Built as a full-stack frontend engineering project demonstrating:

Modern React development
TypeScript
Responsive UI design
REST-style API routes
Database integration
Authentication
State management
Production deployment

Live Demo: https://college-discovery-silk.vercel.app

Repository: https://github.com/Jeevanjohnjacob/college-discovery



