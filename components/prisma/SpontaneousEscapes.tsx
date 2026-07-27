import { Button } from "@/components/ui/button";
import { Zap, Clock, Sparkles, ArrowRight, Star, MapPin } from "lucide-react";
import { getSpontaneousStays, type Listing } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";

export function SpontaneousEscapes({ listings }: { listings?: Listing[] }) {
  const stays = getSpontaneousStays(listings);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="hand-border bg-mustard/40 p-6 sm:p-8 mb-8 flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-cream px-3 py-1 shadow-hard-sm">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Spontaneous escapes</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold leading-tight">
            Free bed. Free hours. Go now.
          </h2>
          <p className="mt-2 text-sm max-w-xl">
            Boutique stays with a room open in the next 72 hours. Book direct, save 20-35%,
            and the host throws in something extra as a welcome.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-cream border-2 border-foreground rounded-full px-4 py-2 shadow-hard-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-hand text-lg">{stays.length} deals refreshed today</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {stays.map((s, i) => (
          <article
            key={s.slug}
            className={cn(
              "hand-border bg-cream overflow-hidden flex flex-col",
              i % 2 === 0 ? "sm:rotate-[-0.4deg]" : "sm:rotate-[0.4deg]",
            )}
          >
            <div className={cn("relative aspect-[16/10] bg-gradient-to-br border-b-2 border-foreground", s.color)}>
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

            <div className="p-5 flex flex-col gap-3 flex-1">
              <div>
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <MapPin className="w-3 h-3" /> {s.neighborhood} · {s.location}
                </div>
                <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight">{s.name}</h3>
                <p className="font-hand text-lg text-muted-foreground leading-tight">{s.tagline}</p>
              </div>

              <div className="bg-mustard/40 border-2 border-dashed border-foreground/40 rounded-xl p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  ✿ Host is throwing in
                </p>
                <ul className="text-sm space-y-0.5">
                  {s.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Host: <span className="font-bold text-foreground">{s.hostName}</span>
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground line-through">€{s.originalPrice}</span>
                    <span className="font-display text-2xl font-extrabold">€{s.dealPrice}</span>
                    <span className="text-xs text-muted-foreground">/ night</span>
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-11 font-bold hover:bg-primary/90">
                  Grab it <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-center font-hand text-xl text-muted-foreground">
        deals update every morning — no fees, straight to the host ✿
      </p>
    </section>
  );
}
