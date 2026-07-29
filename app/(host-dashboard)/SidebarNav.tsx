"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, Eye, BookOpen, CalendarDays, Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();

  const nav = [
    { id: "/host/builder", label: "Create Your Website", icon: Hammer },
    { id: "/host/preview", label: "Preview Website", icon: Eye },
    { id: "/host/bookings", label: "Booking History", icon: BookOpen },
    { id: "/host/escapes", label: "Calendar & Availability", icon: CalendarDays },
    { id: "/host/properties", label: "Properties", icon: Home },
    { id: "/host/perks", label: "Guest Perks", icon: Heart },
  ];

  return (
    <nav className="space-y-1">
      {nav.map((item) => {
        const isActive = pathname === item.id || (item.id === '/host/preview' && pathname.startsWith('/stay/'));
        const Icon = item.icon;
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
