import { Zap, Clock, Sparkles, ArrowRight, Star, MapPin } from "lucide-react";
import { getFlashDeals } from "@/lib/perks-store";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/prisma-types";

import Link from "next/link";

export function FlashDeals() {
  const stays = getFlashDeals();

  return (
    <section className="pb-16">
      <div className="hand-border bg-mustard/40 p-6 sm:p-8 mb-8 flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-cream px-3 py-1 shadow-hard-sm">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Flash deals</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold leading-tight">
            Free bed. Free hours. Go now.
          </h2>
          <p className="mt-2 text-sm max-w-xl">
            Boutique stays with a room open in the next 72 hours. Book direct, save 20–35%,
            and the host throws in something extra as a welcome.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-cream border-2 border-foreground rounded-full px-4 py-2 shadow-hard-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-hand text-lg">{stays.length} deals refreshed today</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {stays.map((s) => (
          <Link
            href={`/stay/${s.slug}`}
            target="_blank"
            key={s.slug}
            className="hand-border bg-cream overflow-hidden flex flex-col text-left transition-transform hover:-translate-y-1 block"
          >
            <div className="relative aspect-[16/10] border-b-2 border-foreground overflow-hidden">
              <img
                src={s.photo}
                alt={`${s.name} in ${s.location}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-mustard border-2 border-foreground rounded-full px-3 py-1 text-xs font-bold shadow-hard-sm">
                <Zap className="w-3 h-3" /> Available {s.window.toLowerCase()}
              </div>
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-cream border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                <Star className="w-3 h-3 fill-mustard" /> {s.rating}
              </div>
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-foreground text-cream rounded-full px-2 py-0.5 text-xs font-bold">
                <Clock className="w-3 h-3" /> {s.hoursLeft}h left
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                <MapPin className="w-3 h-3" /> {s.location}
              </div>
              <p className="font-display font-extrabold text-2xl leading-tight mt-1">{s.name}</p>
              <p className="font-hand text-lg text-muted-foreground leading-tight">{s.tagline}</p>

              <ul className="mt-3 space-y-1">
                {s.perks.map((p) => (
                  <li key={p} className="text-sm flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 text-accent shrink-0" /> {p}
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t-2 border-dashed border-foreground/30 flex items-end justify-between">
                <div>
                  <span className="text-sm text-muted-foreground line-through mr-1">€{s.originalPrice}</span>
                  <span className="font-display font-extrabold text-2xl text-primary">€{s.dealPrice}</span>
                  <span className="text-xs text-muted-foreground"> / night</span>
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1 h-10 px-4 rounded-xl border-2 border-foreground shadow-hard-sm",
                  "bg-primary text-primary-foreground font-bold text-sm",
                )}>
                  Book direct <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
