"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface CollegeSummary {
  id: string;
  name: string;
  slug: string;
  location: string;
  type: string;
}

interface Props {
  excludeIds: string[];
  onSelect: (college: { id: string; name: string; slug: string }) => void;
  onClose: () => void;
}

export function CollegeSearchPicker({ excludeIds, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CollegeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 1) {
      // Show all colleges when no query
      fetchColleges("");
      return;
    }
    const timer = setTimeout(() => fetchColleges(query), 250);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchColleges = async (search: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?search=${encodeURIComponent(search)}&limit=10`);
      const data = await res.json();
      setResults(
        (data.colleges ?? []).filter((c: CollegeSummary) => !excludeIds.includes(c.id))
      );
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = (type: string) =>
    type.charAt(0) + type.slice(1).toLowerCase();

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 animate-in"
    >
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto py-1">
        {loading ? (
          <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
        ) : results.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">No colleges found</div>
        ) : (
          results.map((college) => (
            <button
              key={college.id}
              onClick={() => onSelect({ id: college.id, name: college.name, slug: college.slug })}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 truncate">{college.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {college.location} · {typeLabel(college.type)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
