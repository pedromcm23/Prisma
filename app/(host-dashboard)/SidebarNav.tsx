"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, BookOpen, Zap, Gift, Settings, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();

  const nav = [
    { id: "/host/dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "/host/builder", label: "Create Your Website", icon: Hammer },
    { id: "/host/properties", label: "Properties", icon: Home },
    { id: "/host/bookings", label: "Booking History", icon: BookOpen },
    { id: "/host/escapes", label: "Calendar & Availability", icon: Zap },
    { id: "/host/perks", label: "Guest Perks", icon: Gift },
  ];

  return (
    <nav className="space-y-1">
      {nav.map((item) => {
        const isActive = pathname === item.id;
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

      <div className="pt-2 mt-2 border-t border-foreground/10">
        <Link
          href="/host/settings"
          className={cn(
            "w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold transition-colors",
            pathname === "/host/settings" ? "bg-primary text-primary-foreground shadow-hard-sm" : "hover:bg-mustard/30 text-muted-foreground"
          )}
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>
    </nav>
  );
}
