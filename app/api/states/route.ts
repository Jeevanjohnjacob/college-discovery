import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const states = await prisma.college.findMany({
    select: { state: true },
    distinct: ["state"],
    orderBy: { state: "asc" },
  });
  return NextResponse.json({ states: states.map((s) => s.state) });
}
