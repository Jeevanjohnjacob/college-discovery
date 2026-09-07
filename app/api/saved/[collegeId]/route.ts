import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ isSaved: false });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ isSaved: false });

  const { collegeId } = await params;

  const saved = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });

  return NextResponse.json({ isSaved: !!saved });
}
