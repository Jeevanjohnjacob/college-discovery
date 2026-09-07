import { prisma } from "@/lib/prisma";
import { Prisma, CollegeType, Ownership } from "@prisma/client";
import { CollegeCard } from "./CollegeCard";
import { CollegeFiltersPanel } from "./CollegeFiltersPanel";
import { PaginationBar } from "./PaginationBar";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

function getString(val: string | string[] | undefined): string {
  if (!val) return "";
  return Array.isArray(val) ? val[0] : val;
}

export async function CollegeListingContent({ searchParams }: Props) {
  const search = getString(searchParams.search);
  const state = getString(searchParams.state);
  const type = getString(searchParams.type);
  const ownership = getString(searchParams.ownership);
  const minFees = parseInt(getString(searchParams.minFees) || "0");
  const maxFees = parseInt(getString(searchParams.maxFees) || "9999999");
  const minRating = parseFloat(getString(searchParams.minRating) || "0");
  const sortBy = getString(searchParams.sortBy) || "rating";
  const page = Math.max(1, parseInt(getString(searchParams.page) || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const validTypes = Object.values(CollegeType);
  const validOwnerships = Object.values(Ownership);

  const where: Prisma.CollegeWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(state && { state: { equals: state, mode: "insensitive" } }),
    ...(type && validTypes.includes(type as CollegeType) && {
      type: type as CollegeType,
    }),
    ...(ownership && validOwnerships.includes(ownership as Ownership) && {
      ownership: ownership as Ownership,
    }),
    annualFees: { gte: minFees, lte: maxFees },
    ...(minRating > 0 && { rating: { gte: minRating } }),
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sortBy === "fees_asc" ? { annualFees: "asc" }
    : sortBy === "fees_desc" ? { annualFees: "desc" }
    : sortBy === "nirf" ? { nirf: "asc" }
    : sortBy === "name" ? { name: "asc" }
    : { rating: "desc" };

  const [colleges, total, states] = await Promise.all([
    prisma.college.findMany({
      where, orderBy, skip, take: limit,
      select: {
        id: true, name: true, slug: true, location: true, city: true, state: true,
        type: true, ownership: true, shortDescription: true, imageUrl: true,
        rating: true, totalRatings: true, annualFees: true, naacGrade: true,
        nirf: true, tags: true,
      },
    }),
    prisma.college.count({ where }),
    prisma.college.findMany({
      select: { state: true }, distinct: ["state"], orderBy: { state: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const stateOptions = states.map((s) => s.state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Colleges</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} college{total !== 1 ? "s" : ""} found
          {search && <span> for &ldquo;<strong>{search}</strong>&rdquo;</span>}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <CollegeFiltersPanel
            currentFilters={{ search, state, type, ownership, minFees, maxFees, minRating, sortBy }}
            stateOptions={stateOptions}
          />
        </aside>

        <div className="flex-1 min-w-0">
          {colleges.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h2>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <PaginationBar
                    currentPage={page}
                    totalPages={totalPages}
                    searchParams={searchParams}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
