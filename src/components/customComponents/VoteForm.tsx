"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "../ui/separator";
import { Loader2, CheckCircle, RotateCw } from "lucide-react";
import { ShareModal } from "./ShareModal";
interface VoteFormProps {
  pollId: string;
  options: { id: string; text: string }[];
  pollQuestion: string;
  isCreatorOrAdmin?: boolean;
}

interface Result {
  id: string;
  text: string;
  count: number;
  percentage: number;
  genderBreakdown?: { gender: string; count: number; percentage: number }[];
}

export default function VoteForm({
  pollId,
  options,
  pollQuestion,
  isCreatorOrAdmin,
}: VoteFormProps) {
  const [showResultsManually, setShowResultsManually] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [gender, setGender] = useState<string>("UNKNOWN");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [refreshBtn, setRefreshBtn] = useState(false);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/poll/${pollId}/results`);
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Erreur lors du chargement des résultats", error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !gender) {
      toast.warning("Veuillez choisir une option et un genre");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/poll/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionId: selectedOption, gender }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Erreur lors du vote, Vous avez peut-être déjà voté.", err);
        return;
      }

      toast.success("Vote enregistré avec succès 🎉");
      setSubmitted(true);

      setLoadingResults(true);
      setTimeout(() => {
        fetchResults();
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du vote.");
    } finally {
      setLoading(false);
    }
  };

  const toggleResult = async () => {
    const nextState = !showResultsManually;
    setShowResultsManually(nextState);

    if (nextState) {
      // On va afficher les résultats → on recharge
      setSubmitted(true); // important pour basculer vers le bloc "résultats"
      setLoadingResults(true);
      await fetchResults();
    } else {
      // On revient vers le vote
      setSubmitted(false); // pour réafficher le formulaire
    }
  };

  const refreshResult = () => {
    setRefreshBtn(true);
    setSubmitted(true);
    setShowResultsManually(false);

    setTimeout(async () => {
      setSubmitted(false);
      await fetchResults();
      setRefreshBtn(false);
      setShowResultsManually(true);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <motion.div
      className="space-y-6 p-4 dark:bg-gray-900 bg-gray-900/10 rounded-xl shadow-md max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
       <div className="bg-background p-3 rounded-lg ">   <ShareModal url={`${process.env.NEXTAUTH_URL}/polls/${pollId}`} /> </div>

        {isCreatorOrAdmin ? (
          <div className="text-right mb-0 bg-red-200 ">
            <Button variant="outline" size="sm" onClick={() => toggleResult()}>
              {showResultsManually ? "← Retour au vote" : "Voir les résultats"}
            </Button>
          </div>
        ) : null}
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center">{pollQuestion}</h1>

      <AnimatePresence mode="wait">
        {!submitted && !showResultsManually ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h2 className="text-lg ">Choisissez votre réponse :</h2>
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="space-y-2 mt-2"
              >
                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`flex items-center gap-2 cursor-pointer border-2 rounded-bl-2xl rounded-tr-2xl overflow-hidden transition-colors duration-200 ${
                      selectedOption === option.id
                        ? "bg-green-500 text-white"
                        : "bg-transparent hover:bg-primary/30"
                    }`}
                  >
                    {/* Hide native radio input visually */}
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={option.id}
                      className="cursor-pointer w-full p-4"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="space-y-2 mt-2 flex justify-evenly"
              >
                <div className="flex items-center gap-2  ">
                  <RadioGroupItem value="MALE" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">
                    Homme
                  </Label>
                </div>
                <div className="flex items-center gap-2 cursor-pointer  ">
                  <RadioGroupItem
                    value="FEMALE"
                    id="female"
                    className="cursor-pointer"
                  />
                  <Label htmlFor="female" className="cursor-pointer">
                    Femme
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="UNKNOWN" id="unknown" />
                  <Label htmlFor="unknown" className="cursor-pointer">
                    LGBTQ+
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleVote}
                disabled={loading}
                className="w-full text-base font-medium hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" /> Envoi...
                  </>
                ) : (
                  "Voter"
                )}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {loadingResults ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="animate-spin w-4 h-4" /> Chargement des
                résultats...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <p>Merci pour votre vote !</p>
                </div>

                <h2 className="text-xl font-semibold text-center relative ">
                  Résultats{" "}
                  <span
                    onClick={() => refreshResult()}
                    className=" cursor-pointer absolute right-0 bottom-0"
                  >
                    {" "}
                    {refreshBtn === true ? (
                      <RotateCw className="w-5 h-5 animate-spin " />
                    ) : (
                      <RotateCw className="w-5 h-5 " />
                    )}{" "}
                  </span>
                </h2>

                {results?.map((result) => (
                  <motion.div
                    key={result.id}
                    className="bg-white/10 rounded-lg overflow-hidden p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-between text-sm font-medium">
                      <span>{result.text}</span>
                      <span>{result.percentage}%</span>
                    </div>
                    <motion.div
                      className="h-2 bg-primary rounded mt-1"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percentage}%` }}
                      transition={{ duration: 0.6 }}
                    />

                    {isCreatorOrAdmin && (
                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        {result.genderBreakdown?.map((g) => (
                          <div key={g.gender} className="flex justify-between">
                            <span>
                              {g.gender === "MALE"
                                ? "Hommes"
                                : g.gender === "FEMALE"
                                ? "Femmes"
                                : "LGBTQ+"}
                            </span>
                            <span>
                              {g.count} vote(s) — {g.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
