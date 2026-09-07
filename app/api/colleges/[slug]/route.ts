import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" } },
        facilities: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            user: { select: { name: true, image: true } },
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ college });
  } catch (err) {
    console.error("[GET /api/colleges/:slug]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
