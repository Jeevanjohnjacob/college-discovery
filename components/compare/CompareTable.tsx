"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Check, Minus, ExternalLink } from "lucide-react";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";

interface CollegeDetail {
  id: string; name: string; slug: string; location: string;
  imageUrl: string | null; rating: number; totalRatings: number;
  annualFees: number; hostelFees: number | null; naacGrade: string | null;
  nirf: number | null; approvals: string[]; establishedYear: number;
  type: string; ownership: string;
  courses: { id: string; name: string; degree: string; fees: number }[];
  placements: { avgPackage: number; highestPackage: number; medianPackage: number; placementRate: number; topRecruiters: string[] }[];
  facilities: { name: string; available: boolean }[];
}

interface Props {
  colleges: CollegeDetail[];
  onRemove: (id: string) => void;
}

type WinnerFn = (vals: (number | null)[]) => number | null;

const highest: WinnerFn = (vals) => {
  const nums = vals.filter((v) => v !== null) as number[];
  if (!nums.length) return null;
  return Math.max(...nums);
};
const lowest: WinnerFn = (vals) => {
  const nums = vals.filter((v) => v !== null) as number[];
  if (!nums.length) return null;
  return Math.min(...nums);
};

function WinBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">
      <Check className="h-3 w-3" /> Best
    </span>
  );
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={cn(
      "px-4 py-3 text-sm text-center align-top border-b border-gray-100",
      highlight && "bg-green-50/60"
    )}>
      {children}
    </td>
  );
}

function RowLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap bg-gray-50 border-b border-gray-100 sticky left-0 z-10 w-40">
      {label}
      {sub && <p className="text-xs text-gray-400 font-normal">{sub}</p>}
    </td>
  );
}

export function CompareTable({ colleges, onRemove }: Props) {
  const n = colleges.length;

  const feesVals = colleges.map((c) => c.annualFees);
  const ratingVals = colleges.map((c) => c.rating);
  const nirfVals = colleges.map((c) => c.nirf);
  const avgPackageVals = colleges.map((c) => c.placements[0]?.avgPackage ?? null);
  const highestPackageVals = colleges.map((c) => c.placements[0]?.highestPackage ?? null);
  const placementRateVals = colleges.map((c) => c.placements[0]?.placementRate ?? null);

  const bestFees = lowest(feesVals);
  const bestRating = highest(ratingVals);
  const bestNirf = lowest(nirfVals);
  const bestAvgPkg = highest(avgPackageVals);
  const bestHighPkg = highest(highestPackageVals);
  const bestPlacement = highest(placementRateVals);

  const allFacilities = Array.from(
    new Set(colleges.flatMap((c) => c.facilities.map((f) => f.name)))
  ).sort();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          {/* College headers */}
          <thead>
            <tr>
              <th className="px-4 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-700 sticky left-0 z-20 w-40 border-b border-gray-200">
                Criteria
              </th>
              {colleges.map((college) => (
                <th key={college.id} className="px-4 py-4 border-b border-gray-200 bg-white min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => onRemove(college.id)}
                      className="absolute -top-1 -right-1 p-1 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 transition-colors"
                      aria-label={`Remove ${college.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex flex-col items-center gap-2 pr-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-primary-50">
                        {college.imageUrl ? (
                          <Image src={college.imageUrl} alt={college.name} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🎓</div>
                        )}
                      </div>
                      <div className="text-center">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors flex items-center gap-1 justify-center"
                        >
                          <span className="line-clamp-2">{college.name}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">{college.location}</p>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Section: Basic Info */}
            <SectionHeader label="Basic Information" colSpan={n + 1} />

            <tr>
              <RowLabel label="Rating" />
              {colleges.map((c) => (
                <Cell key={c.id} highlight={c.rating === bestRating}>
                  <StarRating rating={c.rating} totalRatings={c.totalRatings} size="sm" className="justify-center" />
                  {c.rating === bestRating && <WinBadge />}
                </Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="Type" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  <Badge variant="primary" size="sm">
                    {c.type.charAt(0) + c.type.slice(1).toLowerCase()}
                  </Badge>
                </Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="Ownership" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  <span className="text-gray-700">{c.ownership.charAt(0) + c.ownership.slice(1).toLowerCase()}</span>
                </Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="Established" />
              {colleges.map((c) => (
                <Cell key={c.id}><span className="text-gray-700">{c.establishedYear}</span></Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="NIRF Rank" />
              {colleges.map((c) => (
                <Cell key={c.id} highlight={c.nirf !== null && c.nirf === bestNirf}>
                  {c.nirf ? (
                    <span className="font-semibold text-gray-900">
                      #{c.nirf} {c.nirf === bestNirf && <WinBadge />}
                    </span>
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                  )}
                </Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="NAAC Grade" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  {c.naacGrade ? (
                    <Badge variant="success" size="sm">{c.naacGrade}</Badge>
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                  )}
                </Cell>
              ))}
            </tr>

            {/* Section: Fees */}
            <SectionHeader label="Fees" colSpan={n + 1} />

            <tr>
              <RowLabel label="Annual Fees" />
              {colleges.map((c) => (
                <Cell key={c.id} highlight={c.annualFees === bestFees}>
                  <span className={cn("font-semibold", c.annualFees === bestFees ? "text-green-700" : "text-gray-900")}>
                    {formatFees(c.annualFees)}
                  </span>
                  {c.annualFees === bestFees && <WinBadge />}
                </Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="Hostel Fees" sub="per year" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  {c.hostelFees ? (
                    <span className="text-gray-700">{formatFees(c.hostelFees)}</span>
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                  )}
                </Cell>
              ))}
            </tr>

            {/* Section: Placements */}
            <SectionHeader label="Placements (Latest Year)" colSpan={n + 1} />

            <tr>
              <RowLabel label="Avg Package" />
              {colleges.map((c) => {
                const val = c.placements[0]?.avgPackage ?? null;
                return (
                  <Cell key={c.id} highlight={val !== null && val === bestAvgPkg}>
                    {val ? (
                      <span className={cn("font-semibold", val === bestAvgPkg ? "text-green-700" : "text-gray-900")}>
                        {formatPackage(val)} {val === bestAvgPkg && <WinBadge />}
                      </span>
                    ) : (
                      <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                    )}
                  </Cell>
                );
              })}
            </tr>

            <tr>
              <RowLabel label="Highest Package" />
              {colleges.map((c) => {
                const val = c.placements[0]?.highestPackage ?? null;
                return (
                  <Cell key={c.id} highlight={val !== null && val === bestHighPkg}>
                    {val ? (
                      <span className={cn("font-semibold", val === bestHighPkg ? "text-green-700" : "text-gray-900")}>
                        {formatPackage(val)} {val === bestHighPkg && <WinBadge />}
                      </span>
                    ) : (
                      <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                    )}
                  </Cell>
                );
              })}
            </tr>

            <tr>
              <RowLabel label="Median Package" />
              {colleges.map((c) => {
                const val = c.placements[0]?.medianPackage ?? null;
                return (
                  <Cell key={c.id}>
                    {val ? <span className="text-gray-700">{formatPackage(val)}</span> : <Minus className="h-4 w-4 text-gray-300 mx-auto" />}
                  </Cell>
                );
              })}
            </tr>

            <tr>
              <RowLabel label="Placement Rate" />
              {colleges.map((c) => {
                const val = c.placements[0]?.placementRate ?? null;
                return (
                  <Cell key={c.id} highlight={val !== null && val === bestPlacement}>
                    {val !== null ? (
                      <div>
                        <span className={cn("font-semibold text-sm", val === bestPlacement ? "text-green-700" : "text-gray-900")}>
                          {val}%
                        </span>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden w-20 mx-auto">
                          <div
                            className={cn("h-full rounded-full", val === bestPlacement ? "bg-green-500" : "bg-primary-400")}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                        {val === bestPlacement && <WinBadge />}
                      </div>
                    ) : (
                      <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                    )}
                  </Cell>
                );
              })}
            </tr>

            <tr>
              <RowLabel label="Top Recruiters" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  {c.placements[0]?.topRecruiters?.length ? (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {c.placements[0].topRecruiters.slice(0, 4).map((r) => (
                        <span key={r} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  ) : (
                    <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                  )}
                </Cell>
              ))}
            </tr>

            {/* Section: Courses */}
            <SectionHeader label="Courses Offered" colSpan={n + 1} />

            <tr>
              <RowLabel label="Total Courses" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  <span className="font-semibold text-gray-900">{c.courses.length}</span>
                </Cell>
              ))}
            </tr>

            <tr>
              <RowLabel label="Sample Courses" />
              {colleges.map((c) => (
                <Cell key={c.id}>
                  <div className="flex flex-col gap-1">
                    {c.courses.slice(0, 3).map((course) => (
                      <span key={course.id} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg text-left">
                        {course.degree}: {course.name.replace(course.degree, "").trim().replace(/^[,\s]+/, "")}
                      </span>
                    ))}
                  </div>
                </Cell>
              ))}
            </tr>

            {/* Section: Facilities */}
            <SectionHeader label="Facilities" colSpan={n + 1} />

            {allFacilities.map((facility) => (
              <tr key={facility}>
                <RowLabel label={facility} />
                {colleges.map((c) => {
                  const has = c.facilities.some((f) => f.name === facility && f.available);
                  return (
                    <Cell key={c.id}>
                      {has ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-300 mx-auto" />
                      )}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeader({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 border-b border-gray-200"
      >
        {label}
      </td>
    </tr>
  );
}
