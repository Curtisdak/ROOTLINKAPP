"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import VoteForm from "@/components/customComponents/VoteForm";
import { FullLoading } from "@/components/customComponents/FullLoading";
import { useSession } from "next-auth/react";


// import ResultChart from "@/components/customComponents/ResultChart"; // (optionnel, si tu veux afficher les résultats avec graphique)

export default  function PollVotePage() {
  const { id } = useParams();
  const [pollData, setPollData] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);


const {data:Session} = useSession();




  useEffect(() => {
    if (!id) return;
    const fetchPoll = async () => {
      try {
        const res = await fetch(`/api/poll/${id}/results`);
        if (!res.ok) throw new Error("Erreur chargement sondage");
        const data = await res.json();
        setPollData(data);
      } catch (err) {
        console.log(err)
        toast.error("Sondage introuvable ou erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const isCreatorOrAdmin =
    Session?.user?.role === "ADMIN" || Session?.user?.id === pollData?.creatorId;

  const handleVoteSuccess = async () => {
    setHasVoted(true);
    const res = await fetch(`/api/poll/${id}/vote`);
    const updated = await res.json();
    setPollData(updated);
  };

  if (loading) return <FullLoading message="Chargement du sondage..." />;

  if (!pollData) return <p className="text-center text-muted-foreground mt-10">Sondage introuvable.</p>;

  return (
    <div className="w-auto h-screen mx-auto my-auto py-10 px-4 flex flex-col justify-center place-items-center-safe ">

      {!hasVoted ? (
        <VoteForm
          pollId={pollData.pollId}
          pollQuestion={pollData.question}
          isCreatorOrAdmin={isCreatorOrAdmin}
          options={pollData.results.map((opt: any) => ({
            id: opt.id,
            text: opt.text,
          }))}
          onSuccess={handleVoteSuccess}
        />
      ) : (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Résultats du sondage
          </h2>

          {pollData.results.map((opt: any) => (
            <div key={opt.id} className="bg-muted p-4 rounded-md shadow">
              <p className="font-medium">{opt.text}</p>
              <div className="h-3 bg-primary/20 rounded mt-1">
                <div
                  className="h-3 bg-primary rounded"
                  style={{ width: `${opt.percentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {opt.count} votes – {opt.percentage}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
