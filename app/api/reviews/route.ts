import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  collegeId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(150),
  content: z.string().min(20).max(2000),
  pros: z.string().optional(),
  cons: z.string().optional(),
  batch: z.number().optional(),
  course: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = reviewSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }

  const { collegeId, rating, title, content, pros, cons, batch, course } = result.data;

  const review = await prisma.review.create({
    data: { collegeId, userId, rating, title, content, pros, cons, batch, course },
    include: { user: { select: { name: true, image: true } } },
  });

  // Update college aggregate rating
  const allReviews = await prisma.review.findMany({
    where: { collegeId },
    select: { rating: true },
  });
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await prisma.college.update({
    where: { id: collegeId },
    data: { rating: Math.round(avg * 10) / 10, totalRatings: allReviews.length },
  });

  return NextResponse.json({ review }, { status: 201 });
}
