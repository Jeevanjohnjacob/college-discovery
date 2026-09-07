import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const ids = searchParams.getAll("id");

    if (!ids.length || ids.length > 3) {
      return NextResponse.json(
        { error: "Provide between 1 and 3 college IDs" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" }, take: 1 },
        facilities: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });

    // Preserve the requested order
    const ordered = ids.map((id) => colleges.find((c) => c.id === id)).filter(Boolean);

    return NextResponse.json({ colleges: ordered });
  } catch (err) {
    console.error("[GET /api/colleges/compare]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
