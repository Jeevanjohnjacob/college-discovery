import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, CollegeType, Ownership } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const type = searchParams.get("type") || "";
    const ownership = searchParams.get("ownership") || "";
    const minFees = parseInt(searchParams.get("minFees") || "0");
    const maxFees = parseInt(searchParams.get("maxFees") || "9999999");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const sortBy = searchParams.get("sortBy") || "rating";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    const validTypes = Object.values(CollegeType);
    const validOwnerships = Object.values(Ownership);

    const where: Prisma.CollegeWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
          { shortDescription: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(state && { state: { equals: state, mode: "insensitive" } }),
      ...(type && validTypes.includes(type as CollegeType) && {
        type: type as CollegeType,
      }),
      ...(ownership && validOwnerships.includes(ownership as Ownership) && {
        ownership: ownership as Ownership,
      }),
      annualFees: { gte: minFees, lte: maxFees },
      ...(minRating > 0 && { rating: { gte: minRating } }),
    };

    const orderBy: Prisma.CollegeOrderByWithRelationInput =
      sortBy === "fees_asc" ? { annualFees: "asc" }
      : sortBy === "fees_desc" ? { annualFees: "desc" }
      : sortBy === "nirf" ? { nirf: "asc" }
      : sortBy === "name" ? { name: "asc" }
      : { rating: "desc" };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true, name: true, slug: true, location: true, city: true,
          state: true, type: true, ownership: true, shortDescription: true,
          imageUrl: true, rating: true, totalRatings: true, annualFees: true,
          naacGrade: true, nirf: true, tags: true,
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges, total, page, limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[GET /api/colleges]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
