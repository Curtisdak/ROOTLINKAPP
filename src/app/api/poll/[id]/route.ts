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
    return NextResponse.json({ error: "not allowed" }, { status: 401 });
  }
 const body = await req.json();
  const { question, published } = body;

  const updated = await prisma.poll.update({
    where: { id: params.id },
    data: {
      question,
      published,
    },
    include: { options: true },
  });



   // If just published now, broadcast
  if (published) {
     await emitSocketEvent("new-poll", updated)
  }
  return NextResponse.json(updated);
}
