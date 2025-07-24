import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPollSchema } from "@/lib/validators";
import { emitSocketEvent } from "@/lib/socket";

// PATCH: Met à jour un sondage existant
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const pollId = params.id;
  const body = await req.json();
  const parsed = createPollSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { question, options, published } = parsed.data;

  try {
    // Supprimer les anciennes options
    await prisma.pollOption.deleteMany({
      where: { pollId },
    });

    const updatedPoll = await prisma.poll.update({
      where: { id: pollId },
      data: {
        question,
        published,
        options: {
          create: options.map((text: string) => ({ text: text.trim() })),
        },
      },
      include: { options: true },
    });

    if (published) {
      try {
        await emitSocketEvent("poll-updated", "broadcast-updated-poll", {
          content: `Nouveau sondage publié : ${question}`,
          createdAt: new Date().toISOString(),
          readAt: null,
          type: "UPDATEDPOLL",
          linkId: pollId,
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
            type: "UPDATEDPOLL",
            linkId: pollId,
            content: `Nouveau sondage publié : ${updatedPoll.question} `,
          })),
        });
      } catch (err) {
        console.error("🔴 Échec émission socket", err);
      }
    }
    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error("Erreur de mise à jour du sondage:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE: Supprime un sondage existant
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const pollId = params.id;

  try {
    await prisma.poll.delete({
      where: { id: pollId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du sondage:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
