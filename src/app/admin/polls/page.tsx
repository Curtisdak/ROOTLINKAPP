"use client";

import CreatePollForm from "@/components/customComponents/createPollForm";
import PollList from "@/components/customComponents/PollList";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { usePolls } from "@/context/pollContext";

const pollPageAdmin = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [input, setInput]=useState<string>("")
 const { polls, refreshPolls } = usePolls();

 
  const filteredPolls = polls.filter((poll) => poll.question.toLowerCase().includes(input.toLowerCase())  )

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="w-full flex items-center justify-between  p-4 bg-primary/10">
        <h1 className="hidden text-xl  md:flex gap-2  ">
          {" "}
          <MoveLeft
            strokeWidth={5}
            className="cursor-pointer animate-pulse "
            onClick={() => router.back()}
          />{" "}
          Mes Sondages
        </h1>

        <div className=" flex items-center gap-2  ">
        
            {" "}
            <Input type="text" className="" placeholder="recherchez vos sondage..." onChange={(e)=> setInput(e.target.value)} />{" "}
           
         
          <CreatePollForm  />
        </div>
      </div>
      <div className="">
        <PollList polls={filteredPolls} refreshPolls={refreshPolls} />{" "}
      </div>
    </div>
  );
};

export default pollPageAdmin;
