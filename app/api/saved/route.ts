import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, location: true, city: true,
          state: true, type: true, ownership: true, shortDescription: true,
          imageUrl: true, rating: true, totalRatings: true, annualFees: true,
          naacGrade: true, nirf: true, tags: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ saved: saved.map((s) => ({ ...s.college, savedAt: s.createdAt })) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collegeId } = await req.json();
  if (!collegeId) {
    return NextResponse.json({ error: "collegeId is required" }, { status: 400 });
  }

  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });

  if (existing) {
    await prisma.savedCollege.delete({
      where: { userId_collegeId: { userId, collegeId } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedCollege.create({ data: { userId, collegeId } });
  return NextResponse.json({ saved: true });
}
