"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Map, LayoutGrid, Star, MapPin, Search, Sparkles, ArrowRight, X, Zap, Heart } from "lucide-react";
import { type Listing } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";
import { StatusPill, IconOut } from "@/components/app-header";
import { signOut } from "next-auth/react";
import { SpontaneousEscapes } from "@/components/prisma/SpontaneousEscapes";
import { SharePerkForm } from "@/components/prisma/SharePerkForm";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/map-view"), { 
  ssr: false,
  loading: () => <div className="w-full aspect-[16/10] rounded-2xl border-2 border-foreground shadow-hard-lg bg-cream flex items-center justify-center animate-pulse" />
});

interface SearchClientProps {
  initialListings: Listing[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
}

export function SearchClient({ initialListings, user }: SearchClientProps) {
  const [tab, setTab] = useState<"discover" | "spontaneous" | "share">("discover");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [query, setQuery] = useState("");

  const filtered = initialListings.filter((l) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleOpenMapMarker = (l: Listing) => {
    window.open(`/stay/${l.slug}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b-2 border-foreground shadow-hard-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold hidden sm:inline-block">Prisma</span>
          </Link>

          {tab === "discover" && (
            <div className="relative flex-1 min-w-[150px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where to? Lisbon, Puglia…"
                className="pl-9 border-2 border-foreground shadow-hard-sm rounded-xl h-11 bg-white"
              />
            </div>
          )}
          {tab !== "discover" && <div className="flex-1" />}

          <div className="flex items-center gap-3">
            {tab === "discover" && (
              <div className="inline-flex rounded-xl border-2 border-foreground shadow-hard-sm bg-white overflow-hidden shrink-0">
                <button
                  onClick={() => setView("map")}
                  className={cn(
                    "px-3 h-11 text-sm font-bold inline-flex items-center gap-1.5",
                    view === "map" && "bg-primary text-primary-foreground",
                  )}
                >
                  <Map className="w-4 h-4" /> <span className="hidden sm:inline">Map</span>
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "px-3 h-11 text-sm font-bold inline-flex items-center gap-1.5 border-l-2 border-foreground",
                    view === "grid" && "bg-primary text-primary-foreground",
                  )}
                >
                  <LayoutGrid className="w-4 h-4" /> <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 sm:gap-3">
                <StatusPill label={user.role === "HOST" ? "HOST" : "GUEST"} tone={user.role === "HOST" ? "primary" : "mustard"} />
                <IconOut onClick={() => signOut({ callbackUrl: '/' })} label={user.name || "User"} />
              </div>
            )}
            {!user && (
              <Link href="/api/auth/signin">
                <Button className="h-11 rounded-xl bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* Main tabs */}
        <div className="mx-auto max-w-6xl px-4 pb-3 flex flex-wrap gap-2">
          <TabBtn active={tab === "discover"} onClick={() => setTab("discover")} icon={<Sparkles className="w-3.5 h-3.5" />}>
            Discover
          </TabBtn>
          <TabBtn active={tab === "spontaneous"} onClick={() => setTab("spontaneous")} icon={<Zap className="w-3.5 h-3.5" />}>
            Flash Deals
          </TabBtn>
          <TabBtn active={tab === "share"} onClick={() => setTab("share")} icon={<Heart className="w-3.5 h-3.5" />}>
            Share the Love
          </TabBtn>
        </div>
      </header>

      {tab === "discover" && (
        <>
          <div className="mx-auto max-w-6xl px-4 py-8">
            <p className="font-hand text-3xl text-accent">stays with soul</p>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold">
              {filtered.length} boutique {filtered.length === 1 ? "stay" : "stays"} waiting for you
            </h1>
          </div>

          {view === "grid" ? (
            <GridView listings={filtered} />
          ) : (
            <DynamicMap listings={filtered} onOpen={handleOpenMapMarker} />
          )}
        </>
      )}

      {tab === "spontaneous" && (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="font-hand text-3xl text-accent">last-minute love</p>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-2">
            Escape in the next 72 hours
          </h1>
          <SpontaneousEscapes listings={initialListings} />
        </div>
      )}

      {tab === "share" && (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="font-hand text-3xl text-accent">a little thank-you</p>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold mb-2">
            Share your stay, get €15 back
          </h1>
          <SharePerkForm properties={initialListings} />
        </div>
      )}

      <footer className="border-t-2 border-foreground bg-primary text-primary-foreground mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold">Prisma</p>
          <Link href="/host/builder" className="font-hand text-lg underline">Are you a host? Build your site →</Link>
        </div>
      </footer>
    </div>
  );
}

function GridView({ listings }: { listings: Listing[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
        {listings.map((l, i) => (
          <Link
            key={l.slug}
            href={`/stay/${l.slug}`}
            target="_blank"
            className={cn(
              "polaroid text-left group transition-transform hover:-translate-y-1 block",
              ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2deg]", "rotate-[-1.5deg]", "rotate-[1deg]"][i % 6],
              i % 5 === 0 && "lg:col-span-2",
            )}
          >
            <div className="tape" />
            <div
              className={cn(
                "rounded-sm border-2 border-foreground p-4 flex flex-col justify-between relative overflow-hidden",
                !l.image && "bg-gradient-to-br",
                !l.image && l.color,
                i % 5 === 0 ? "aspect-[16/9]" : "aspect-[5/4]",
              )}
            >
              {l.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${l.image})` }}
                />
              )}
              {l.image && <div className="absolute inset-0 bg-black/20 z-0" />}
              
              <div className="flex items-center justify-between relative z-10">
                <div className="bg-white/90 border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-mustard" /> {l.rating}
                </div>
                <div className="bg-foreground text-cream rounded-full px-2 py-0.5 text-xs font-bold">
                  Host: {l.hostName}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {l.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-wider bg-white/90 border border-foreground rounded-full px-2 py-0.5">
                    {t}
                  </span>
                ))}
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

function ListingDrawer({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  return (
    <div>
      <SheetHeader className="text-left">
        <div className="flex items-center justify-between">
          <div className="bg-mustard border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {listing.neighborhood}
          </div>
          <button onClick={onClose} className="rounded-full border-2 border-foreground w-8 h-8 flex items-center justify-center hover:bg-mustard/30">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SheetTitle className="font-display text-3xl font-extrabold">{listing.name}</SheetTitle>
        <SheetDescription className="font-hand text-xl text-accent">
          {listing.tagline}
        </SheetDescription>
      </SheetHeader>

      <div
        className={cn(
          "mt-4 rounded-xl border-2 border-foreground shadow-hard aspect-video relative overflow-hidden",
          !listing.image && "bg-gradient-to-br",
          !listing.image && listing.color
        )}
      >
        {listing.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${listing.image})` }}
          />
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold">
          <Star className="w-3 h-3 fill-mustard" /> {listing.rating}
        </div>
        <div className="text-sm">Host: <span className="font-bold">{listing.hostName}</span></div>
      </div>

      <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-foreground/40 bg-mustard/20">
        <p className="font-hand text-xl">from the host</p>
        <p className="text-sm">
          "Come as a guest, leave as a friend. I'll leave fresh bread and a little map of my favorite corners."
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {listing.tags.map((t) => (
          <span key={t} className="text-xs font-bold uppercase tracking-wider bg-cream border-2 border-foreground rounded-full px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-muted-foreground">from </span>
          <span className="font-display font-extrabold text-2xl">€{listing.price}</span>
          <span className="text-xs text-muted-foreground"> / night</span>
        </div>
      </div>

      <Link href={`/stay/${listing.slug}`} target="_blank" rel="noopener noreferrer">
        <Button className="w-full mt-3 bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-12 font-bold hover:bg-primary/90">
          View Direct Page <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

function TabBtn({
  active, onClick, icon, children,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
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
