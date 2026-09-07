import Link from "next/link";
import { Search, GitCompareArrows, Bookmark, ArrowRight, Star, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { CollegeCard } from "@/components/colleges/CollegeCard";

export const dynamic = "force-dynamic";

async function getFeaturedColleges() {
  return prisma.college.findMany({
    where: { nirf: { lte: 5 } },
    orderBy: { nirf: "asc" },
    take: 6,
    select: {
      id: true, name: true, slug: true, location: true, city: true, state: true,
      type: true, ownership: true, shortDescription: true, imageUrl: true,
      rating: true, totalRatings: true, annualFees: true, naacGrade: true,
      nirf: true, tags: true,
    },
  });
}

async function getStats() {
  const [totalColleges, totalReviews] = await Promise.all([
    prisma.college.count(),
    prisma.review.count(),
  ]);
  return { totalColleges, totalReviews };
}

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeaturedColleges(), getStats()]);

  const collegeTypes = [
    { label: "Engineering", type: "ENGINEERING", emoji: "⚙️" },
    { label: "Management", type: "MANAGEMENT", emoji: "💼" },
    { label: "Medical", type: "MEDICAL", emoji: "🏥" },
    { label: "Law", type: "LAW", emoji: "⚖️" },
    { label: "Arts", type: "ARTS", emoji: "🎨" },
    { label: "Science", type: "SCIENCE", emoji: "🔬" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-amber-300" />
              <span>Trusted by lakhs of students across India</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your{" "}
              <span className="text-amber-300">Perfect College</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              Search, compare, and shortlist from hundreds of colleges across India.
              Make informed decisions with real placement data and student reviews.
            </p>

            {/* Search bar */}
            <form action="/colleges" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search colleges, cities, courses..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
                />
              </div>
              <Button type="submit" size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold shadow-lg flex-shrink-0">
                Search
              </Button>
            </form>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 pt-4 text-sm text-primary-100">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-amber-300" />
                <span><strong className="text-white">{stats.totalColleges}+</strong> colleges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-300" />
                <span><strong className="text-white">{stats.totalReviews}+</strong> reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitCompareArrows className="h-4 w-4 text-amber-300" />
                <span>Side-by-side compare</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {collegeTypes.map((ct) => (
              <Link
                key={ct.type}
                href={`/colleges?type=${ct.type}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 border border-gray-200 hover:border-primary-200 rounded-full text-sm font-medium text-gray-700 transition-all"
              >
                <span>{ct.emoji}</span>
                {ct.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/colleges" className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Discover Colleges</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Filter by location, fees, type, and ratings. Find your best match instantly.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
              Browse colleges <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link href="/compare" className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <GitCompareArrows className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Compare Colleges</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Side-by-side comparison of fees, placements, ratings, and facilities.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:gap-2 transition-all">
              Start comparing <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link href="/saved" className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <Bookmark className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Save & Shortlist</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Bookmark colleges you like and build your personal shortlist.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 group-hover:gap-2 transition-all">
              View saved <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Top ranked colleges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Ranked Colleges</h2>
            <p className="text-sm text-gray-500 mt-1">NIRF top-ranked institutions</p>
          </div>
          <Link href="/colleges">
            <Button variant="outline" size="sm">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>
    </div>
  );
}
