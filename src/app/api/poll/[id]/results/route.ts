import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const poll = await prisma.poll.findUnique({
    where: { id: params.id },
    include: {
      options: {
        include: {
          votes: {
            include: {
              participant: true,
            },
          },
        },
      },
    },
  });

  if (!poll) {
    return NextResponse.json({ error: "sondage introuvable" }, { status: 404 });
  }

  // ----- Overall gender stats -----
  const genderCounts = {
    MALE: 0,
    FEMALE: 0,
    UNKNOWN: 0,
  };

  poll.options.forEach((option) => {
    option.votes.forEach((vote) => {
      const gender = vote.participant.gender;
      if (genderCounts[gender] !== undefined) {
        genderCounts[gender]++;
      }
    });
  });

  const totalVotes = genderCounts.MALE + genderCounts.FEMALE + genderCounts.UNKNOWN;

  const genderStats = Object.entries(genderCounts).map(([gender, count]) => ({
    gender,
    count,
    percentage: totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100),
  }));

  // ----- Per-option stats including gender breakdown -----
  const results = poll.options.map((option) => {
    const genderBreakdown = {
      MALE: 0,
      FEMALE: 0,
      UNKNOWN: 0,
    };

    option.votes.forEach((vote) => {
      const gender = vote.participant.gender;
      if (genderBreakdown[gender] !== undefined) {
        genderBreakdown[gender]++;
      }
    });

    const totalVotesForOption = option.votes.length;

    return {
      id: option.id,
      text: option.text,
      count: totalVotesForOption,
      percentage: totalVotes === 0 ? 0 : Math.round((totalVotesForOption / totalVotes) * 100),
      genderBreakdown: Object.entries(genderBreakdown).map(([gender, count]) => ({
        gender,
        count,
        percentage:
          totalVotesForOption === 0
            ? 0
            : Math.round((count / totalVotesForOption) * 100),
      })),
    };
  });

  return NextResponse.json({
    pollId: poll.id,
    question: poll.question,
    totalVotes,
    genderStats,
    results,
  });
}
