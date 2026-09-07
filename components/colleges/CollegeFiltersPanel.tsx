"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Filters {
  search: string;
  state: string;
  type: string;
  ownership: string;
  minFees: number;
  maxFees: number;
  minRating: number;
  sortBy: string;
}

interface Props {
  currentFilters: Filters;
  stateOptions: string[];
}

const typeOptions = [
  { value: "ENGINEERING", label: "Engineering" },
  { value: "MANAGEMENT", label: "Management" },
  { value: "MEDICAL", label: "Medical" },
  { value: "LAW", label: "Law" },
  { value: "ARTS", label: "Arts" },
  { value: "SCIENCE", label: "Science" },
  { value: "COMMERCE", label: "Commerce" },
  { value: "PHARMACY", label: "Pharmacy" },
  { value: "ARCHITECTURE", label: "Architecture" },
  { value: "DESIGN", label: "Design" },
];

const ownershipOptions = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private" },
  { value: "DEEMED", label: "Deemed" },
  { value: "AUTONOMOUS", label: "Autonomous" },
];

const sortOptions = [
  { value: "rating", label: "Highest Rating" },
  { value: "fees_asc", label: "Fees: Low to High" },
  { value: "fees_desc", label: "Fees: High to Low" },
  { value: "nirf", label: "NIRF Rank" },
  { value: "name", label: "Name A–Z" },
];

const ratingOptions = [
  { value: "0", label: "Any rating" },
  { value: "3", label: "3+ stars" },
  { value: "3.5", label: "3.5+ stars" },
  { value: "4", label: "4+ stars" },
  { value: "4.5", label: "4.5+ stars" },
];

export function CollegeFiltersPanel({ currentFilters, stateOptions }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<Filters>(currentFilters);

  const applyFilters = useCallback((filters: Filters) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.state) params.set("state", filters.state);
    if (filters.type) params.set("type", filters.type);
    if (filters.ownership) params.set("ownership", filters.ownership);
    if (filters.minFees > 0) params.set("minFees", String(filters.minFees));
    if (filters.maxFees < 9999999) params.set("maxFees", String(filters.maxFees));
    if (filters.minRating > 0) params.set("minRating", String(filters.minRating));
    if (filters.sortBy !== "rating") params.set("sortBy", filters.sortBy);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  const clearAll = () => {
    const reset: Filters = { search: "", state: "", type: "", ownership: "", minFees: 0, maxFees: 9999999, minRating: 0, sortBy: "rating" };
    setLocal(reset);
    router.push(pathname);
  };

  const hasActiveFilters = local.search || local.state || local.type || local.ownership || local.minRating > 0 || local.sortBy !== "rating";

  const filterForm = (
    <div className="space-y-5">
      {/* Sort */}
      <Select
        label="Sort by"
        value={local.sortBy}
        options={sortOptions}
        onChange={(e) => {
          const updated = { ...local, sortBy: e.target.value };
          setLocal(updated);
          applyFilters(updated);
        }}
      />

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
        <form
          onSubmit={(e) => { e.preventDefault(); applyFilters(local); }}
          className="flex gap-2"
        >
          <Input
            placeholder="College name, city..."
            value={local.search}
            onChange={(e) => setLocal({ ...local, search: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Button type="submit" size="sm" variant="secondary" className="flex-shrink-0">Go</Button>
        </form>
      </div>

      {/* State */}
      <Select
        label="State"
        value={local.state}
        options={stateOptions.map((s) => ({ value: s, label: s }))}
        placeholder="All states"
        onChange={(e) => {
          const updated = { ...local, state: e.target.value };
          setLocal(updated);
          applyFilters(updated);
        }}
      />

      {/* Type */}
      <Select
        label="College Type"
        value={local.type}
        options={typeOptions}
        placeholder="All types"
        onChange={(e) => {
          const updated = { ...local, type: e.target.value };
          setLocal(updated);
          applyFilters(updated);
        }}
      />

      {/* Ownership */}
      <Select
        label="Ownership"
        value={local.ownership}
        options={ownershipOptions}
        placeholder="All"
        onChange={(e) => {
          const updated = { ...local, ownership: e.target.value };
          setLocal(updated);
          applyFilters(updated);
        }}
      />

      {/* Minimum rating */}
      <Select
        label="Minimum Rating"
        value={String(local.minRating)}
        options={ratingOptions}
        onChange={(e) => {
          const updated = { ...local, minRating: parseFloat(e.target.value) };
          setLocal(updated);
          applyFilters(updated);
        }}
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="w-full text-red-600 hover:bg-red-50">
          <X className="h-4 w-4" /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters {hasActiveFilters && <span className="text-primary-600 font-bold">•</span>}
          </span>
          <X className={cn("h-4 w-4 transition-transform", open ? "rotate-0" : "rotate-45")} />
        </Button>
        {open && (
          <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            {filterForm}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        {filterForm}
      </div>
    </>
  );
}
