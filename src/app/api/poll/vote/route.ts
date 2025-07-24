import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Facultatif : je définis les genres autorisés
const allowedGenders = ["MALE", "FEMALE", "UNKNOWN"] as const;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { pollId, optionId, gender } = body;

  if (!pollId || !optionId || !gender) {
    return NextResponse.json(
      { error: "pollId, optionId et gender sont requis." },
      { status: 400 }
    );
  }

  if (!allowedGenders.includes(gender)) {
    return NextResponse.json({ error: "Genre invalide." }, { status: 400 });
  }

  try {
    const userId = session?.user?.id || null;

    // Si l'utilisateur est connecté, je vérifie s'il a déjà voté
    if (userId) {
      const existingVote = await prisma.pollParticipant.findUnique({
        where: {
          userId_pollId: {
            userId,
            pollId,
          },
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { error: "Vous avez déjà voté pour ce sondage." },
          { status: 409 }
        );
      }
    }

    // Créer un participant
    const participant = await prisma.pollParticipant.create({
      data: {
        pollId,
        userId,
        gender,
      },
    });

    // Enregistrer le vote
    const vote = await prisma.vote.create({
      data: {
        optionId,
        participantId: participant.id,
      },
    });

    return NextResponse.json({ success: true, vote });
  } catch (error) {
    console.error("Erreur lors du vote :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du vote." },
      { status: 500 }
    );
  }
}
