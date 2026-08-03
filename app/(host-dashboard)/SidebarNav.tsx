"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, Eye, BookOpen, CalendarDays, Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav({ hasProperties }: { hasProperties?: boolean }) {
  const pathname = usePathname();

  const nav = [
    { id: "/host/builder", label: "Create Your Website", icon: Hammer },
    { id: "/host/preview", label: "Preview Website", icon: Eye },
    { id: "/host/bookings", label: "Booking History", icon: BookOpen },
    { id: "/host/escapes", label: "Calendar & Flash Deals", icon: CalendarDays },
    { id: "/host/properties", label: "Property Management", icon: Home },
    { id: "/host/perks", label: "Guest Perks", icon: Heart },
  ];

  return (
    <nav className="space-y-1">
      {nav.map((item) => {
        const isActive = pathname === item.id || (item.id === '/host/preview' && pathname.startsWith('/stay/'));
        const Icon = item.icon;
        // The Preview Website button is NEVER clickable from the sidebar. 
        // It's only an indicator for when they are actually on that step.
        const isDisabled = item.id === '/host/preview';

        if (isDisabled) {
          return (
            <div
              key={item.id}
              className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold text-foreground cursor-default"
            >
              <Icon className="w-4 h-4" /> {item.label}
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.id}
            className={cn(
              "w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold transition-colors",
              isActive ? "bg-primary text-primary-foreground shadow-hard-sm" : "hover:bg-mustard/30 text-foreground"
            )}
          >
            <Icon className="w-4 h-4" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
