"use client";

import Link from "next/link";
import { Sparkles, LogOut, UserPlus, Info, CalendarCheck, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export function AppHeader({ user, role }: { user?: any, role?: string }) {
  const status = !user ? "unauth" : role === "HOST" ? "host" : "guest";

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b-2 border-foreground shadow-hard-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3 flex-wrap">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-extrabold text-foreground">Prisma</span>
        </Link>

        <div className="flex-1" />

        {status === "unauth" && (
          <div className="flex items-center gap-4">
            <Link href="/about" className="flex items-center gap-1.5 text-sm font-bold hover:text-primary transition-colors">
              <Info className="w-4 h-4" /> About Us
            </Link>
            <Link href="/api/auth/signin">
            <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-xl h-10 px-4 font-bold hover:bg-primary/90">
              Sign In / Register
            </Button>
          </Link>
        )}

        {status === "guest" && (
          <div className="flex items-center gap-4 sm:gap-6">
            <StatusPill label="GUEST" tone="mustard" />
            <Link href="/guest/bookings" className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:text-primary transition-colors">
              <CalendarCheck className="w-4 h-4" /> My Bookings
            </Link>
            <Link href="/guest/rewards" className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:text-primary transition-colors">
              <Gift className="w-4 h-4" /> My Rewards
            </Link>
            <Link href="/about" className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:text-primary transition-colors">
              <Info className="w-4 h-4" /> About Us
            </Link>
            <Link href="/host/builder" className="hidden sm:inline-block">
              <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-xl h-10 px-4 font-bold hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-1" /> Become a Host
              </Button>
            </Link>
            <IconOut onClick={() => signOut({ callbackUrl: '/' })} label={user?.name} />
          </div>
        )}

        {status === "host" && (
          <div className="flex items-center gap-4 sm:gap-6">
            <StatusPill label="HOST" tone="primary" />
            <Link href="/about" className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:text-primary transition-colors">
              <Info className="w-4 h-4" /> About Us
            </Link>
            <IconOut onClick={() => signOut({ callbackUrl: '/' })} label={user?.name} />
          </div>
        )}
      </div>
    </header>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: "mustard" | "primary" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-hard-sm",
      tone === "mustard" ? "bg-mustard text-foreground" : "bg-primary text-primary-foreground",
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" /> {label}
    </span>
  );
}

export function IconOut({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      title={label ? `Sign out ${label}` : "Sign out"}
      className="w-10 h-10 rounded-full border-2 border-foreground shadow-hard-sm bg-white flex items-center justify-center hover:bg-mustard/30 text-foreground transition-colors shrink-0"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
