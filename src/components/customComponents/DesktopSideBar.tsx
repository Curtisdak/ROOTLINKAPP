"use client";

import React from "react";
import { Bell, Heart, Home, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DesktopSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: <Home size={24} />, label: "Accueil" },
    { href: "/pages/likes", icon: <Heart size={24} />, label: "Favoris" },
    { href: "/pages/add-property", icon: <Plus size={24} />, label: "Ajouter" },
    { href: "/pages/properties", icon: <Search size={24} />, label: "Rechercher" },
    { href: "/pages/notifications", icon: <Bell size={24} />, label: "Alertes" },
  ];

  const dontShowNav = ["/login", "/register", "/error", "/404", "reset-password", "forgot-password"];
  const shouldHide = dontShowNav.some((path) => pathname.includes(path));

  if (shouldHide) return null;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-56 h-screen fixed left-0 top-0 border-r bg-background px-4 py-6 space-y-2">
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-primary hover:bg-muted"
            }`}
          >
            {React.cloneElement(icon, {
              strokeWidth: 2,
            })}
            <span>{label}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default DesktopSidebar;
