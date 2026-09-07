export type CollegeType =
  | "ENGINEERING"
  | "MEDICAL"
  | "MANAGEMENT"
  | "LAW"
  | "ARTS"
  | "SCIENCE"
  | "COMMERCE"
  | "PHARMACY"
  | "ARCHITECTURE"
  | "DESIGN";

export type Ownership = "GOVERNMENT" | "PRIVATE" | "DEEMED" | "AUTONOMOUS";

export interface CollegeSummary {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  type: CollegeType;
  ownership: Ownership;
  shortDescription: string;
  imageUrl: string | null;
  rating: number;
  totalRatings: number;
  annualFees: number;
  naacGrade: string | null;
  nirf: number | null;
  tags: string[];
}

export interface CollegeDetail extends CollegeSummary {
  description: string;
  establishedYear: number;
  website: string | null;
  phone: string | null;
  email: string | null;
  hostelFees: number | null;
  approvals: string[];
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
  facilities: Facility[];
}

export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: number;
  totalSeats: number;
  fees: number;
  description?: string | null;
}

export interface Placement {
  id: string;
  year: number;
  avgPackage: number;
  highestPackage: number;
  medianPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface Facility {
  id: string;
  name: string;
  available: boolean;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  pros?: string | null;
  cons?: string | null;
  batch?: number | null;
  course?: string | null;
  helpful: number;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface CollegeFilters {
  search?: string;
  state?: string;
  type?: CollegeType;
  ownership?: Ownership;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  sortBy?: "rating" | "fees_asc" | "fees_desc" | "nirf" | "name";
  page?: number;
  limit?: number;
}

export interface PaginatedColleges {
  colleges: CollegeSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompareData {
  colleges: CollegeDetail[];
}
