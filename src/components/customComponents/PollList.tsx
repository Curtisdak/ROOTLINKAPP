"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { FullLoading } from "./FullLoading";
import {
  CircleOff,
  Radio,
 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import DeleteUI from "./DeleteUI";
import { usePolls } from "@/context/pollContext";
import { cn } from "@/lib/utils";
import UpdatePollForm from "./UpdatePollForm";
import { Poll } from "@prisma/client";

export default function PollList({polls,refreshPolls}:{ polls: Poll[];
  refreshPolls?: () => void;}) {


  const { loading, setPolls } = usePolls();

  const deletePoll = async (id: string) => {
    try {
      const res = await fetch(`/api/poll/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Suppression échouée");
        return;
      }

      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== id));
      toast.success("Sondage supprimé");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  

  useEffect(() => {
    if (refreshPolls) {
      refreshPolls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <FullLoading message="Chargement des sondages..." />;

  if (polls.length === 0)
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>Aucun sondage disponible pour le moment.</p>
      </div>
    );

  return (
    <TooltipProvider>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className={cn(
              "border rounded-lg p-5 shadow-sm hover:shadow-md transition relative space-y-4",
              poll.published ? "bg-green-600/10" : "bg-card"
            )}
          >
            {/* Status Indicator */}
            <div className="absolute top-2 right-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  {poll.published ? (
                    <Radio
                      className="text-green-500 w-4 h-4 animate-pulse"
                      aria-label="Publié"
                    />
                  ) : (
                    <CircleOff
                      className="text-muted-foreground w-4 h-4"
                      aria-label="Non publié"
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{poll.published ? "Publié" : "Non publié"}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Poll Question */}
            <h3 className="text-lg font-semibold text-foreground">
              {poll.question}
            </h3>

            {/* Footer Actions */}
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-4">
                {/* Delete */}
                <Tooltip>
                  <TooltipTrigger>
                    <DeleteUI
                      productId={poll.id}
                      alertTitle=""
                      alertDesc=""
                      deleteAction={deletePoll}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Supprimer</p>
                  </TooltipContent>
                </Tooltip>

                {/* Edit */}
                <Tooltip>
                  <TooltipTrigger>
                    <UpdatePollForm poll={poll}/>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Modifier</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* View Results */}
              <Button variant="default" size="sm">
                Voir résultats
              </Button>
            </div>

            {/* Timestamp */}
            <p className="text-sm text-muted-foreground italic absolute bottom-2">
              Créé{" "}
              {formatDistanceToNow(new Date(poll.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
