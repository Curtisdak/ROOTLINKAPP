import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { emitSocketEvent } from "@/lib/socket";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "not allowed" }, { status: 401 });
  }

  try {
    await prisma.poll.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.log("Susppression echoué :",error)
    return NextResponse.json({ error: "Suppression échouée" }, { status: 500 },);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }

  const body = await req.json();
  const { question, published, options } = body;

  if (!question || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // Step 1: Update poll question & publish status
    const updatedPoll = await prisma.poll.update({
      where: { id: params.id },
      data: {
        question,
        published,
      },
      include: { options: true },
    });

    // Step 2: Delete old options
    await prisma.pollOption.deleteMany({
      where: { pollId: params.id },
    });

    // Step 3: Recreate new options
    await prisma.pollOption.createMany({
      data: options.map((text: string) => ({
        text,
        pollId: params.id,
      })),
    });

    // Step 4: Emit socket event if published
    if (published) {
      await emitSocketEvent("new-poll", updatedPoll);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du sondage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}