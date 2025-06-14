"use client";

import Link from "next/link";
import SideBar01 from "./SideBar01";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const NavBar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="bg-background flex justify-between items-center sticky w-full px-4 py-2 border-b">
      {/* Left Logo */}
      <Link href="/">
        <p className="font-bold text-primary text-lg">rootlink {user?.role}</p>
      </Link>

      {/* Right Icons (Mobile & Desktop) */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {!user?.id ? (
          <Link href="/login">
            <Button variant="ghost">Se connecter</Button>
          </Link>
        ) : (
          <div className="">
            <SideBar01 />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
