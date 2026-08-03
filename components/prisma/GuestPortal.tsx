"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Map, LayoutGrid, Star, Search, Sparkles, MapPin, Zap, ArrowRight, Home, Shield, Users, LogIn } from "lucide-react";
import dynamic from "next/dynamic";


const DynamicMap = dynamic(() => import("@/components/map-view"), { 
  ssr: false,
  loading: () => <div className="w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg bg-cream flex items-center justify-center animate-pulse" />
});
import { SAMPLE_LISTINGS, type Listing } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";
import { SpontaneousEscapes } from "./SpontaneousEscapes";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";

type Tab = "discover" | "flash";

type Props = {
  listings?: Listing[];
  flashDeals?: any[];
  isAuthenticated?: boolean;
};

export function GuestPortal({ listings = SAMPLE_LISTINGS, flashDeals = [], isAuthenticated = false }: Props) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tab, setTab] = useState<Tab>("discover");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [query, setQuery] = useState("");

  const filtered = listings.filter((l) => {
    const q = query.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Controls row */}
      <div className="pt-5 flex items-center gap-3 flex-wrap">
        {tab === "discover" ? (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where to? Lisbon, Puglia, Marrakech…"
              className="pl-9 border-2 border-foreground shadow-hard-sm rounded-xl h-11 bg-white"
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {tab === "discover" && (
          <div className="inline-flex rounded-xl border-2 border-foreground shadow-hard-sm bg-white overflow-hidden">
            <button
              onClick={() => setView("map")}
              className={cn("px-3 h-11 text-sm font-bold inline-flex items-center gap-1.5", view === "map" && "bg-primary text-primary-foreground")}
            >
              <Map className="w-4 h-4" /> Map
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn("px-3 h-11 text-sm font-bold inline-flex items-center gap-1.5 border-l-2 border-foreground", view === "grid" && "bg-primary text-primary-foreground")}
            >
              <LayoutGrid className="w-4 h-4" /> Grid
            </button>
          </div>
        )}
      </div>

      {/* Main tabs */}
      <div className="pt-3 flex flex-wrap gap-2">
        <TabBtn active={tab === "discover"} onClick={() => setTab("discover")} icon={<Sparkles className="w-3.5 h-3.5" />}>Discover</TabBtn>
        <TabBtn active={tab === "flash"} onClick={() => setTab("flash")} icon={<Zap className="w-3.5 h-3.5" />}>Flash Deals</TabBtn>
      </div>

      {tab === "discover" && (
        <>
          <div className="py-8">
            <p className="font-hand text-3xl text-accent">stays with soul</p>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold">
              {filtered.length} boutique {filtered.length === 1 ? "stay" : "stays"} waiting for you
            </h1>
            <p className="text-sm text-muted-foreground mt-2">Tap any stay to open its own website — one click, no detours.</p>
          </div>

          {view === "grid" ? (
            <GridView listings={filtered} isAuthenticated={isAuthenticated} onAuthRequired={() => setShowLoginModal(true)} />
          ) : (
            <MapView listings={filtered} isAuthenticated={isAuthenticated} onAuthRequired={() => setShowLoginModal(true)} />
          )}
        </>
      )}

      {tab === "flash" && (
        <div className="py-8">
          <SpontaneousEscapes stays={flashDeals} isAuthenticated={isAuthenticated} onAuthRequired={() => setShowLoginModal(true)} />
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream border-2 border-foreground rounded-2xl w-full max-w-md shadow-hard-lg relative flex flex-col items-center text-center p-8">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-extrabold">Prisma</span>
            </div>

            <h1 className="font-display text-3xl font-extrabold mb-3">Sign in to Prisma</h1>
            <p className="text-sm opacity-80 mb-8 max-w-[260px]">
              One account for guests and hosts. Book direct with independent hosts.
            </p>

            <button
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-foreground rounded-xl h-12 px-4 font-bold hover:bg-gray-50 transition-colors shadow-hard-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-xs opacity-60 mt-6 max-w-[280px]">
              By continuing you agree to Prisma's terms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-full border-2 border-foreground shadow-hard-sm text-sm font-bold transition-transform",
        active ? "bg-primary text-primary-foreground -translate-y-0.5" : "bg-white hover:bg-mustard/30",
      )}
    >
      {icon} {children}
    </button>
  );
}

function GridView({ listings, isAuthenticated, onAuthRequired }: { listings: Listing[], isAuthenticated: boolean, onAuthRequired: () => void }) {
  return (
    <section className="pb-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
        {listings.map((l, i) => (
          <Link
            href={`/stay/${l.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                onAuthRequired();
              }
            }}
            key={l.slug}
            className={cn(
              "polaroid text-left group transition-transform hover:-translate-y-1",
              ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2deg]", "rotate-[-1.5deg]", "rotate-[1deg]"][i % 6],
              i % 5 === 0 && "lg:col-span-2",
            )}
          >
            <div className="tape" />
            <div className={cn(
              "relative overflow-hidden rounded-sm border-2 border-foreground",
              i % 5 === 0 ? "aspect-[16/9]" : "aspect-[5/4]",
            )}>
              <img
                src={l.image || ""}
                alt={`${l.name}, boutique stay in ${l.location}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-b from-foreground/25 via-transparent to-foreground/30">
                <div className="flex items-center justify-between">
                  <div className="bg-white/95 border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold inline-flex items-center gap-1">
                    <Star className="w-3 h-3 fill-mustard" /> {l.rating}
                  </div>
                  <div className="bg-foreground text-cream rounded-full px-2 py-0.5 text-xs font-bold">Host: {l.hostName}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {l.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-wider bg-white/95 border border-foreground rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 px-1">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                <MapPin className="w-3 h-3" /> {l.neighborhood}
              </div>
              <p className="font-display font-extrabold text-xl leading-tight mt-0.5">{l.name}</p>
              <p className="font-hand text-lg text-muted-foreground leading-tight">{l.tagline}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">from </span>
                  <span className="font-display font-extrabold text-lg">€{l.price}</span>
                  <span className="text-xs text-muted-foreground"> / night</span>
                </div>
                <span className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Visit site <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MapView({ listings, isAuthenticated, onAuthRequired }: { listings: Listing[], isAuthenticated: boolean, onAuthRequired: () => void }) {
  const handleOpen = (l: Listing) => {
    if (!isAuthenticated) {
      onAuthRequired();
    } else {
      window.open(`/stay/${l.slug}`, '_blank');
    }
  };

  return (
    <section className="pb-16">
      <DynamicMap listings={listings} onOpen={handleOpen} />
    </section>
  );
}
