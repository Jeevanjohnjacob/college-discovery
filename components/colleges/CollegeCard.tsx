"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, GitCompareArrows, Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CollegeSummary } from "@/lib/types";
import { cn, formatFees } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useCompare } from "@/context/CompareContext";

interface CollegeCardProps {
  college: CollegeSummary;
  initialSaved?: boolean;
}

const typeColors: Record<string, string> = {
  ENGINEERING: "primary",
  MEDICAL: "danger",
  MANAGEMENT: "success",
  LAW: "warning",
  ARTS: "default",
  SCIENCE: "primary",
  COMMERCE: "default",
  PHARMACY: "success",
  ARCHITECTURE: "warning",
  DESIGN: "default",
};

export function CollegeCard({ college, initialSaved = false }: CollegeCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();
  const [saved, setSaved] = useState(initialSaved);
  const [savingLoading, setSavingLoading] = useState(false);
  const inCompare = isInCompare(college.id);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    setSavingLoading(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(college.id);
    } else if (canAdd) {
      addToCompare({ id: college.id, name: college.name, slug: college.slug });
    }
  };

  return (
    <Link href={`/colleges/${college.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
          {college.imageUrl ? (
            <Image
              src={college.imageUrl}
              alt={college.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
          )}
          {college.nirf && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-2 py-1 rounded-lg shadow">
              NIRF #{college.nirf}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                {college.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{college.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant={typeColors[college.type] as "primary" | "default" | "success" | "warning" | "danger"} size="sm">
                {college.type.charAt(0) + college.type.slice(1).toLowerCase()}
              </Badge>
              <Badge variant="outline" size="sm">
                {college.ownership.charAt(0) + college.ownership.slice(1).toLowerCase()}
              </Badge>
              {college.naacGrade && (
                <Badge variant="success" size="sm">NAAC {college.naacGrade}</Badge>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-center py-3 bg-gray-50 rounded-lg mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Fees/yr</p>
                <p className="text-sm font-semibold text-gray-900">{formatFees(college.annualFees)}</p>
              </div>
              <div className="border-x border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">Rating</p>
                <p className="text-sm font-semibold text-gray-900">{college.rating.toFixed(1)} ★</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Reviews</p>
                <p className="text-sm font-semibold text-gray-900">{college.totalRatings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <span className="flex-1 text-xs font-medium text-primary-600 group-hover:underline">
              View Details →
            </span>
            <button
              onClick={handleCompare}
              title={inCompare ? "Remove from compare" : canAdd ? "Add to compare" : "Max 3 colleges"}
              className={cn(
                "p-2 rounded-lg text-xs transition-colors",
                inCompare
                  ? "bg-primary-100 text-primary-700"
                  : canAdd
                  ? "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              )}
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={savingLoading}
              title={saved ? "Unsave" : "Save college"}
              className={cn(
                "p-2 rounded-lg transition-colors",
                saved
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
              )}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
