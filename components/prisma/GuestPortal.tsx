"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Map, LayoutGrid, Star, MapPin, Search, Sparkles, ArrowRight, Zap } from "lucide-react";
import { SAMPLE_LISTINGS, type Listing } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";
import { SpontaneousEscapes } from "./SpontaneousEscapes";
import Link from "next/link";

type Tab = "discover" | "flash";

type Props = {
  listings?: Listing[];
};

export function GuestPortal({ listings = SAMPLE_LISTINGS }: Props) {
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
            <GridView listings={filtered} />
          ) : (
            <MapView listings={filtered} />
          )}
        </>
      )}

      {tab === "flash" && (
        <div className="py-8">
          <SpontaneousEscapes listings={listings} />
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

function GridView({ listings }: { listings: Listing[] }) {
  return (
    <section className="pb-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
        {listings.map((l, i) => (
          <Link
            href={`/stay/${l.slug}`}
            target="_blank"
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
                src={l.photo}
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

function MapView({ listings }: { listings: Listing[] }) {
  return (
    <section className="pb-16">
      <div className="relative w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg overflow-hidden bg-gradient-to-br from-ocean/20 via-cream to-mustard/30">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(oklch(0.38 0.12 250 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.38 0.12 250 / 0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 62" preserveAspectRatio="none">
          <path d="M0,20 Q15,10 30,22 T60,25 T100,18 L100,62 L0,62 Z" fill="oklch(0.83 0.16 88 / 0.35)" stroke="oklch(0.19 0.02 60)" strokeWidth="0.3" />
        </svg>
        {listings.map((l) => (
          <Link href={`/stay/${l.slug}`} target="_blank" key={l.slug} className="absolute -translate-x-1/2 -translate-y-full group" style={{ left: `${l.lng}%`, top: `${l.lat}%` }}>
            <div className="relative flex flex-col items-center">
              <div className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap group-hover:-translate-y-0.5 transition-transform">€{l.price}</div>
              <div className="w-3 h-3 bg-primary border-2 border-foreground rotate-45 -mt-1.5" />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-2 bg-cream border-2 border-foreground shadow-hard-sm rounded-lg overflow-hidden w-40 text-left">
                <img src={l.photo} alt="" className="w-full h-20 object-cover border-b-2 border-foreground" />
                <p className="px-2 py-1 text-xs font-bold">{l.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground text-center font-hand text-xl">tap a pin to open the stay's website ✿</p>
    </section>
  );
}
