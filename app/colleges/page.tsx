import { Suspense } from "react";
import { Metadata } from "next";
import { CollegeListingContent } from "@/components/colleges/CollegeListingContent";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { CompareTray } from "@/components/colleges/CompareTray";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Colleges",
  description: "Search and filter colleges by location, type, fees, and ratings.",
};

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  return (
    <>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <CollegeCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <CollegeListingContent searchParams={resolvedParams} />
      </Suspense>
      <CompareTray />
    </>
  );
}
