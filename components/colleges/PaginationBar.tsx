"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

function buildPageUrl(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(searchParams)) {
    if (key === "page") continue;
    if (val) params.set(key, Array.isArray(val) ? val[0] : val);
  }
  params.set("page", String(page));
  return `/colleges?${params.toString()}`;
}

export function PaginationBar({ currentPage, totalPages, searchParams }: Props) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={buildPageUrl(searchParams, currentPage - 1)}
        className={cn(
          "p-2 rounded-lg border text-sm transition-colors",
          currentPage === 1
            ? "border-gray-200 text-gray-300 pointer-events-none"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
        )}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400 text-sm">…</span>
        ) : (
          <Link
            key={p}
            href={buildPageUrl(searchParams, p as number)}
            className={cn(
              "min-w-[38px] h-[38px] flex items-center justify-center rounded-lg text-sm font-medium transition-colors border",
              p === currentPage
                ? "bg-primary-600 text-white border-primary-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildPageUrl(searchParams, currentPage + 1)}
        className={cn(
          "p-2 rounded-lg border text-sm transition-colors",
          currentPage === totalPages
            ? "border-gray-200 text-gray-300 pointer-events-none"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
        )}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
