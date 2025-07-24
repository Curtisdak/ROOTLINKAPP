import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    select: {
    id: true,
    content: true,
    createdAt: true,
    readAt: true,
    type: true,
  },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications, {status:200});
}
