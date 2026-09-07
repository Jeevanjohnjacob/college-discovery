"use client";

import { useRouter } from "next/navigation";
import { X, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { Button } from "@/components/ui/Button";

export function CompareTray() {
  const router = useRouter();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const handleCompare = () => {
    const ids = compareList.map((c) => `id=${c.id}`).join("&");
    router.push(`/compare?${ids}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">
            Compare ({compareList.length}/3):
          </span>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {compareList.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-800 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200"
              >
                {item.name.length > 25 ? item.name.slice(0, 25) + "…" : item.name}
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {Array.from({ length: 3 - compareList.length }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center w-24 h-7 border-2 border-dashed border-gray-300 rounded-full text-xs text-gray-400"
              >
                + Add
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
            <Button
              size="sm"
              onClick={handleCompare}
              disabled={compareList.length < 2}
              className="gap-1.5"
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
