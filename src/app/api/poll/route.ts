import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitSocketEvent } from "@/lib/socket";
import { createPollSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = createPollSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { question, options, published } = parsed.data;

  if (!question || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: "Invalid poll data" }, { status: 400 });
  }

  const poll = await prisma.poll.create({
    data: {
      question,
      published,
      createdById: session.user.id,
      options: {
        create: options.map((text: string) => ({ text: text.trim() })),
      },
    },
    include: { options: true },
  });

  if (published) {
    try {
      await emitSocketEvent("new-poll", "broadcast-new-poll", {
        content: `Nouveau sondage publié : ${question}`,
        createdAt: new Date().toISOString(),
        readAt: null,
        type: "NEWPOLL",
        linkId:poll.id
      });
      console.log("🟢 Sondage émis via socket");

      // it is important to know who we want to notify here we want to notify all users
      const notifyUser = await prisma.user.findMany({
        where: {
          id: { not: session.user.id },
          role: { in: ["USER", "ADMIN", "CREATOR"] },
        },
        select: { id: true },
      });

      // Créer les notifications

      await prisma.notification.createMany({
        data: notifyUser.map((user) => ({
          userId: user.id,
          type: "NEWPOLL",
          linkId:poll.id,
          content: `Nouveau sondage disponible : ${poll.question} `,
        })),
      });
    } catch (err) {
      console.error("🔴 Échec émission socket", err);
    }
  }

  return NextResponse.json(poll);
}

export async function GET() {
  const polls = await prisma.poll.findMany({
    where: { published: true },
    include: {
      options: { include: { votes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!polls.length) {
    return NextResponse.json(
      { error: "Sondage indisponible" },
      { status: 400 }
    );
  }

  return NextResponse.json(polls, { status: 200 });
}
