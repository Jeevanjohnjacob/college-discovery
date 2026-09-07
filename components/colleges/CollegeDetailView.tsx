"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  MapPin, Globe, Phone, Mail, Calendar, Award, TrendingUp,
  BookOpen, Building2, Users, Star, Bookmark, BookmarkCheck,
  GitCompareArrows, ChevronRight, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Card } from "@/components/ui/Card";
import { ReviewForm } from "@/components/colleges/ReviewForm";
import { useCompare } from "@/context/CompareContext";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Tab = "overview" | "courses" | "placements" | "reviews";

interface Props {
  college: {
    id: string; name: string; slug: string; location: string; city: string;
    state: string; type: string; ownership: string; description: string;
    shortDescription: string; website: string | null; phone: string | null;
    email: string | null; imageUrl: string | null; rating: number;
    totalRatings: number; annualFees: number; hostelFees: number | null;
    naacGrade: string | null; nirf: number | null; approvals: string[];
    tags: string[]; establishedYear: number;
    courses: { id: string; name: string; degree: string; duration: number; totalSeats: number; fees: number }[];
    placements: { id: string; year: number; avgPackage: number; highestPackage: number; medianPackage: number; placementRate: number; topRecruiters: string[] }[];
    facilities: { id: string; name: string; available: boolean }[];
    reviews: { id: string; rating: number; title: string; content: string; pros: string | null; cons: string | null; batch: number | null; course: string | null; helpful: number; createdAt: Date; user: { name: string | null; image: string | null } }[];
  };
}

const tabConfig: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Building2 className="h-4 w-4" /> },
  { id: "courses", label: "Courses", icon: <BookOpen className="h-4 w-4" /> },
  { id: "placements", label: "Placements", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
];

export function CollegeDetailView({ college }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();
  const inCompare = isInCompare(college.id);
  const latestPlacement = college.placements[0];

  const handleSave = async () => {
    if (!session) { router.push("/auth/login"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } finally {
      setSaving(false);
    }
  };

  const handleCompare = () => {
    if (inCompare) removeFromCompare(college.id);
    else if (canAdd) addToCompare({ id: college.id, name: college.name, slug: college.slug });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/colleges" className="hover:text-gray-900">Colleges</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900 font-medium truncate">{college.name}</span>
      </nav>

      {/* Hero section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="relative h-52 sm:h-64 bg-gradient-to-br from-primary-100 to-primary-50">
          {college.imageUrl && (
            <Image src={college.imageUrl} alt={college.name} fill className="object-cover" sizes="100vw" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {college.nirf && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full shadow">
              NIRF #{college.nirf}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="primary">
                  {college.type.charAt(0) + college.type.slice(1).toLowerCase()}
                </Badge>
                <Badge variant="outline">
                  {college.ownership.charAt(0) + college.ownership.slice(1).toLowerCase()}
                </Badge>
                {college.naacGrade && <Badge variant="success">NAAC {college.naacGrade}</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{college.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Est. {college.establishedYear}</span>
                {college.website && (
                  <a href={college.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary-600 hover:underline">
                    <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="mt-3">
                <StarRating rating={college.rating} totalRatings={college.totalRatings} size="md" />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant={inCompare ? "secondary" : "outline"}
                size="sm"
                onClick={handleCompare}
                disabled={!inCompare && !canAdd}
                className="gap-1.5"
              >
                <GitCompareArrows className="h-4 w-4" />
                {inCompare ? "In Compare" : "Compare"}
              </Button>
              <Button
                variant={saved ? "secondary" : "outline"}
                size="sm"
                loading={saving}
                onClick={handleSave}
                className="gap-1.5"
              >
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Annual Fees</p>
              <p className="text-base font-bold text-gray-900">{formatFees(college.annualFees)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Avg Package</p>
              <p className="text-base font-bold text-gray-900">
                {latestPlacement ? formatPackage(latestPlacement.avgPackage) : "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Placement Rate</p>
              <p className="text-base font-bold text-gray-900">
                {latestPlacement ? `${latestPlacement.placementRate}%` : "N/A"}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Total Courses</p>
              <p className="text-base font-bold text-gray-900">{college.courses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-700 bg-primary-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {tab.icon}{tab.label}
                {tab.id === "reviews" && college.reviews.length > 0 && (
                  <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                    {college.reviews.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "overview" && <OverviewTab college={college} />}
          {activeTab === "courses" && <CoursesTab courses={college.courses} />}
          {activeTab === "placements" && <PlacementsTab placements={college.placements} />}
          {activeTab === "reviews" && (
            <ReviewsTab reviews={college.reviews} collegeId={college.id} rating={college.rating} />
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ college }: { college: Props["college"] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{college.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card padding="sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary-600" /> Approvals & Accreditations
          </h3>
          <div className="flex flex-wrap gap-2">
            {college.approvals.map((a) => (
              <span key={a} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 className="h-3 w-3" />{a}
              </span>
            ))}
          </div>
        </Card>

        <Card padding="sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary-600" /> Facilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {college.facilities.filter((f) => f.available).map((f) => (
              <span key={f.id} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {f.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {(college.phone || college.email) && (
        <Card padding="sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
          <div className="space-y-2">
            {college.phone && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />{college.phone}
              </p>
            )}
            {college.email && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />{college.email}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function CoursesTab({ courses }: { courses: Props["college"]["courses"] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Courses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 rounded-tl-lg">Course</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Degree</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Duration</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Seats</th>
              <th className="px-4 py-3 font-semibold text-gray-700 rounded-tr-lg">Fees/yr</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{course.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  <Badge variant="primary" size="sm">{course.degree}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{course.duration} yr{course.duration > 1 ? "s" : ""}</td>
                <td className="px-4 py-3 text-gray-600">{course.totalSeats}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatFees(course.fees)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlacementsTab({ placements }: { placements: Props["college"]["placements"] }) {
  if (!placements.length) {
    return <p className="text-gray-500 text-sm">No placement data available.</p>;
  }
  const latest = placements[0];
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Placement Statistics ({latest.year})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg Package", value: formatPackage(latest.avgPackage), color: "text-green-600" },
          { label: "Highest Package", value: formatPackage(latest.highestPackage), color: "text-primary-600" },
          { label: "Median Package", value: formatPackage(latest.medianPackage), color: "text-amber-600" },
          { label: "Placement Rate", value: `${latest.placementRate}%`, color: "text-teal-600" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placement rate bar */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600 font-medium">Students Placed</span>
          <span className="font-bold text-gray-900">{latest.placementRate}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-700"
            style={{ width: `${latest.placementRate}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-600" /> Top Recruiters
        </h3>
        <div className="flex flex-wrap gap-2">
          {latest.topRecruiters.map((recruiter) => (
            <span key={recruiter} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium shadow-sm">
              {recruiter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({
  reviews, collegeId, rating,
}: {
  reviews: Props["college"]["reviews"];
  collegeId: string;
  rating: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Student Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={rating} size="md" />
            <span className="text-sm text-gray-500">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (!session) { window.location.href = "/auth/login"; return; }
            setShowForm((o) => !o);
          }}
        >
          {showForm ? "Cancel" : "Write Review"}
        </Button>
      </div>

      {showForm && (
        <ReviewForm
          collegeId={collegeId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {(review.user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.user.name || "Anonymous"}</p>
                    {(review.batch || review.course) && (
                      <p className="text-xs text-gray-500">
                        {review.course}{review.batch ? ` · Batch ${review.batch}` : ""}
                      </p>
                    )}
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" showValue={false} />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{review.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {review.pros && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Pros</p>
                      <p className="text-xs text-green-800">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">Cons</p>
                      <p className="text-xs text-red-800">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
