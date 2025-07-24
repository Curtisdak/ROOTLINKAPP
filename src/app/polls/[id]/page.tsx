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
  const [loading, setLoading] = useState(true);


const {data:Session, } = useSession();


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
    Session?.user?.role === "ADMIN" 


  if (loading) return <FullLoading message="Chargement du sondage..." />;

  if (!pollData) return <p className="text-center text-muted-foreground mt-10">Sondage introuvable.</p>;

  return (
    <div className="w-auto  mx-auto my-auto py-10 px-4 flex flex-col justify-center place-items-center-safe ">

     
        <VoteForm
          pollId={pollData.pollId}
          pollQuestion={pollData.question}
          isCreatorOrAdmin={isCreatorOrAdmin}
          options={pollData.results.map((opt: any) => ({
            id: opt.id,
            text: opt.text,
          }))}
         
        />

    </div>
  );
}
