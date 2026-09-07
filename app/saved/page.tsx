import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SavedCollegesView } from "@/components/saved/SavedCollegesView";
import { CompareTray } from "@/components/colleges/CompareTray";

export const metadata: Metadata = {
  title: "Saved Colleges",
  description: "Your shortlisted colleges.",
};

export default async function SavedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login?callbackUrl=/saved");

  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/auth/login");

  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colleges = saved.map((s) => s.college) as any[];

  return (
    <>
      <SavedCollegesView colleges={colleges} />
      <CompareTray />
    </>
  );
}
