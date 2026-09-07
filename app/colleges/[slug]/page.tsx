import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CollegeDetailView } from "@/components/colleges/CollegeDetailView";
import { CompareTray } from "@/components/colleges/CompareTray";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true },
  });
  if (!college) return { title: "College not found" };
  return {
    title: college.name,
    description: college.shortDescription,
  };
}

export const dynamic = "force-dynamic";

async function getCollege(slug: string) {
  return prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      facilities: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });
}

export default async function CollegeDetailPage({ params }: Props) {
  const { slug } = await params;
  const college = await getCollege(slug);
  if (!college) notFound();

  return (
    <>
      <CollegeDetailView college={college} />
      <CompareTray />
    </>
  );
}
