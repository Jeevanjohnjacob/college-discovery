"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, GitCompareArrows, Search, Trash2 } from "lucide-react";
import { CollegeCard } from "@/components/colleges/CollegeCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CollegeSummary } from "@/lib/types";

interface Props {
  colleges: CollegeSummary[];
}

export function SavedCollegesView({ colleges: initial }: Props) {
  const [colleges, setColleges] = useState<CollegeSummary[]>(initial);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const filtered = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnsave = async (collegeId: string, collegeName: string) => {
    if (!confirm(`Remove "${collegeName}" from your saved list?`)) return;
    setRemoving(collegeId);
    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      setColleges((prev) => prev.filter((c) => c.id !== collegeId));
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-amber-500" />
            Saved Colleges
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {colleges.length} college{colleges.length !== 1 ? "s" : ""} in your shortlist
          </p>
        </div>
        <Link href="/colleges">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
            Browse more
          </Button>
        </Link>
      </div>

      {colleges.length === 0 ? (
        /* Empty state */
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <Bookmark className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No saved colleges yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Browse colleges and click the bookmark icon to add them to your shortlist.
          </p>
          <Link href="/colleges">
            <Button>Browse Colleges</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Search within saved */}
          {colleges.length > 3 && (
            <div className="mb-6 max-w-sm">
              <Input
                placeholder="Filter saved colleges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          )}

          {/* Tips banner */}
          {colleges.length >= 2 && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-between gap-3">
              <p className="text-sm text-primary-700">
                <strong>Tip:</strong> Use the compare button on each card to compare up to 3 colleges side-by-side.
              </p>
              <Link href="/compare">
                <Button size="sm" variant="secondary" className="flex-shrink-0">
                  <GitCompareArrows className="h-4 w-4" />
                  Compare
                </Button>
              </Link>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-12">
              No saved colleges match &ldquo;{search}&rdquo;
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((college) => (
                <div key={college.id} className="relative group/card">
                  <CollegeCard college={college} initialSaved={true} />
                  {/* Unsave overlay button */}
                  <button
                    onClick={() => handleUnsave(college.id, college.name)}
                    disabled={removing === college.id}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover/card:opacity-100 transition-all shadow-sm border border-gray-200 z-10"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
