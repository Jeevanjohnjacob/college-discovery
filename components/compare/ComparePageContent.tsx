"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, X, GitCompareArrows, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CollegeSearchPicker } from "@/components/compare/CollegeSearchPicker";
import { CompareTable } from "@/components/compare/CompareTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCompare } from "@/context/CompareContext";

interface CollegeDetail {
  id: string; name: string; slug: string; location: string; city: string;
  state: string; type: string; ownership: string; shortDescription: string;
  imageUrl: string | null; rating: number; totalRatings: number;
  annualFees: number; hostelFees: number | null; naacGrade: string | null;
  nirf: number | null; approvals: string[]; establishedYear: number;
  courses: { id: string; name: string; degree: string; duration: number; totalSeats: number; fees: number }[];
  placements: { id: string; year: number; avgPackage: number; highestPackage: number; medianPackage: number; placementRate: number; topRecruiters: string[] }[];
  facilities: { id: string; name: string; available: boolean }[];
}

interface Props {
  preloadedIds: string[];
}

export function ComparePageContent({ preloadedIds }: Props) {
  const { compareList, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const [colleges, setColleges] = useState<CollegeDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sync preloaded IDs into compare context on first mount
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    if (preloadedIds.length > 0 && compareList.length === 0) {
      // We'll fetch details and sync into context via the fetch below
    }
  }, [preloadedIds, compareList.length, initialized]);

  const activeIds = compareList.length > 0
    ? compareList.map((c) => c.id)
    : preloadedIds;

  const fetchColleges = useCallback(async (ids: string[]) => {
    if (ids.length === 0) { setColleges([]); return; }
    setLoading(true);
    try {
      const query = ids.map((id) => `id=${id}`).join("&");
      const res = await fetch(`/api/colleges/compare?${query}`);
      const data = await res.json();
      const fetched: CollegeDetail[] = data.colleges ?? [];
      setColleges(fetched);
      // Sync into context if they came from URL params
      if (compareList.length === 0 && fetched.length > 0) {
        fetched.forEach((c) => addToCompare({ id: c.id, name: c.name, slug: c.slug }));
      }
    } finally {
      setLoading(false);
    }
  }, [compareList.length, addToCompare]);

  useEffect(() => {
    fetchColleges(activeIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIds.join(",")]);

  const handleAddCollege = (college: { id: string; name: string; slug: string }) => {
    addToCompare(college);
    setShowPicker(false);
  };

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    setColleges((prev) => prev.filter((c) => c.id !== id));
  };

  const canAddMore = compareList.length < 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/colleges" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Colleges
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitCompareArrows className="h-6 w-6 text-primary-600" />
            Compare Colleges
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select up to 3 colleges to compare side-by-side
          </p>
        </div>
        {compareList.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCompare} className="text-red-500 hover:bg-red-50 self-start">
            <X className="h-4 w-4" /> Clear all
          </Button>
        )}
      </div>

      {/* College selector pills */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {compareList.map((item) => (
          <div key={item.id} className="flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-800 px-4 py-2 rounded-xl text-sm font-medium">
            <span className="max-w-[180px] truncate">{item.name}</span>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-primary-400 hover:text-red-500 transition-colors ml-1"
              aria-label={`Remove ${item.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <div className="relative">
            <button
              onClick={() => setShowPicker((o) => !o)}
              className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-primary-400 text-gray-500 hover:text-primary-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add College
            </button>
            {showPicker && (
              <CollegeSearchPicker
                excludeIds={compareList.map((c) => c.id)}
                onSelect={handleAddCollege}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {compareList.length === 0 && !loading && (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <GitCompareArrows className="h-14 w-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No colleges selected</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Add 2–3 colleges to compare their fees, placements, ratings, and more.
          </p>
          <Link href="/colleges">
            <Button>Browse Colleges</Button>
          </Link>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeIds.map((id) => (
            <div key={id} className="space-y-3 p-4 bg-white rounded-xl border">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Compare table */}
      {!loading && colleges.length >= 1 && (
        <CompareTable colleges={colleges} onRemove={handleRemove} />
      )}

      {/* CTA when only 1 college */}
      {!loading && colleges.length === 1 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 text-center">
          Add at least one more college to see the comparison table.
        </div>
      )}
    </div>
  );
}
