"use client";

import CreatePollForm from "@/components/customComponents/createPollForm";
import PollList from "@/components/customComponents/PollList";
import { MoveLeft, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { usePolls } from "@/context/pollContext";

const PollPageAdmin = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const { polls, refreshPolls } = usePolls();

  const filteredPolls = polls.filter((poll) =>
    poll.question.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="w-full flex items-center justify-between gap-4  p-4 bg-primary/10">
        <div className="flex items-center gap-2 ">
          <MoveLeft
            strokeWidth={5}
            className="cursor-pointer animate-pulse "
            onClick={() => router.back()}
          />{" "}
          <h1 className="hidden text-xl  lg:flex gap-2  "> Mes Sondages</h1>
        </div>
        <div className="w-full lg:w-auto flex items-center gap-2  ">
          {" "}
          <Input
            type="search"
            className="ralative"
            placeholder="recherchez vos sondage..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />{" "}

          {input.trim() && <X onClick={()=> setInput("")} strokeWidth={3} className="scale-90 ease-in-out duration-200 cursor-pointer absolute right-25 text-muted-foreground hover:scale-110 hover:text-primary "/>}
          <CreatePollForm />
        </div>
      </div>
      <div className="">
        <PollList polls={filteredPolls} refreshPolls={refreshPolls} />{" "}
      </div>
    </div>
  );
};

export default PollPageAdmin;
