import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const polls = await prisma.poll.findMany({
    include: {
      options: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(polls,{ status: 200 });
}
