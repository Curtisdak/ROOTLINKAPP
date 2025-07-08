"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

// 1. Define the Poll type
export interface Poll {
  id: string;
  question: string;
  published: boolean;
  createdAt: string;
  options: { id: string; text: string }[];
}

// 2. Define the Context Type
interface PollContextType {
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPolls: () => void;
}

// 3. Create Context with proper typing
const PollContext = createContext<PollContextType | undefined>(undefined);

// 4. Provider Component
export const PollProvider = ({ children }: { children: ReactNode }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/poll/all");
      if (!res.ok) throw new Error("Erreur lors du chargement des sondages");
      const data = await res.json();
      setPolls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const value = useMemo(
    () => ({
      polls,
      setPolls,
      loading,
      setLoading,
      refreshPolls: fetchPolls,
    }),
    [polls, loading]
  );

  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
};

// 5. Custom Hook
export const usePolls = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePolls must be used within a PollProvider");
  }
  return context;
};
