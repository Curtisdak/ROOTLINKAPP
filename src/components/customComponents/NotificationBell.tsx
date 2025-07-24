"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/context/notificationContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";
import Link from "next/link";
// import { Button } from "../ui/button";

export default function NotificationBell() {
  const { notifications, loadingNotif, refreshNotifications } =
    useNotifications();

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-0">
        {/* <Button variant="ghost"> */}
        <Bell
          onClick={() => refreshNotifications()}
          className="w-4 h-4 text-primary cursor-pointer hover:scale-105"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
        {/* </Button> */}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-90 max-h-[300px] overflow-y-auto">
        {loadingNotif ? (
          <DropdownMenuItem disabled>Chargement en cours...</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>Aucune notification</DropdownMenuItem>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem key={notif.id}>
              <div className="space-y-1 bg-primary/10 p-5 rounded-lg w-full relative">
                <p className="text-sm">{notif.content}</p>{" "}
                {notif.linkId && (
                  <Link
                    href={`/polls/${notif.linkId}`}
                    className="text-sm text-primary no-underline absolute right-2 bottom-0 ease-in-out duration-500 hover:text-secondary-foreground  "
                  >
                    Voir plus
                  </Link>
                )}
                <p className="text-xs text-muted-foreground italic">
                  {notif.createdAt
                    ? formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : "Récement"}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
