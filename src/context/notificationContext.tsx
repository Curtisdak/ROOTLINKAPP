"use client";
import { createContext, useState, useEffect, useContext } from "react";

const audioNotif =
  typeof Audio !== "undefined" ? new Audio("/audio/audioNotif.mp3") : null;

export interface Notification {
  id: string;
  content: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  linkId:string;
}

import { Dispatch, SetStateAction } from "react";
import { getSocket } from "@/lib/socket";

const NotificationContext = createContext<{
  notifications: Notification[];
  refreshNotifications: () => void;
  loadingNotif: boolean;
  setLoadingNotif: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const fetchNotifications = async () => {
    setLoadingNotif(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setTimeout(async () => {
        setLoadingNotif(false);

        setNotifications(data);

        console.info("Notifactions : ", data);
      }, 3000);
    } catch (error) {
      console.error("erreur de chargement des notifications :", error);
    } finally {
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();

    socket.on("new-poll", (notif: Notification) => {
      console.log("🔔 Nouvelle notification reçue :", notif);
      setNotifications((prev) => [notif, ...prev]);

      if (audioNotif) {
        audioNotif.currentTime = 0; // remet au début
        audioNotif
          .play()
          .catch((err) => console.info("Erreur lecture audio :", err));
      }
    });

    socket.on("poll-updated", (notif: Notification) => {
      console.log("Sondage mis à jour");
      console.log("poll-updated reçu :", notif);
      setNotifications((prev) => [notif, ...prev]);

      if (audioNotif) {
        audioNotif.currentTime = 0; // remet au début
        audioNotif
          .play()
          .catch((err) => console.info("Erreur lecture audio :", err));
      }
    });

    return () => {
      socket.off("new-poll");
      socket.off("poll-updated");
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        refreshNotifications: fetchNotifications,
        loadingNotif,
        setLoadingNotif,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  return ctx;
};

// Souhaites-tu qu’on mette aussi à jour le contenu HTML ou lien de la notification pour aller vers le sondage mis à jour ?
// ✅ Créer un lien dynamique vers le sondage dans la notification ?
// 
// ✅ Marquer les notifications comme lues quand on clique dessus ?
// 
// ✅ Afficher un petit menu "Voir tout" avec une page notifications dédiée ?