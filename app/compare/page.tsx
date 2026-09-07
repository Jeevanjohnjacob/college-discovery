import { Metadata } from "next";
import { ComparePageContent } from "@/components/compare/ComparePageContent";

export const metadata: Metadata = {
  title: "Compare Colleges",
  description: "Compare colleges side-by-side on fees, placements, ratings, and more.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ids = Array.isArray(params.id)
    ? params.id
    : params.id
    ? [params.id]
    : [];

  return <ComparePageContent preloadedIds={ids} />;
}
