import { Button } from "@/components/ui/button";
import { Zap, Clock, Sparkles, ArrowRight, Star, MapPin } from "lucide-react";
import { type SpontaneousStay } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";

export function SpontaneousEscapes({ stays = [], isAuthenticated, onAuthRequired }: { stays?: any[], isAuthenticated?: boolean, onAuthRequired?: () => void }) {

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="hand-border bg-mustard/40 p-6 sm:p-8 mb-8 flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-cream px-3 py-1 shadow-hard-sm">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Flash Deals</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold leading-tight">
            Special bundles. Better prices.
          </h2>
          <p className="mt-2 text-sm max-w-xl">
            Exclusive boutique stays with promotional prices for specific dates. Book direct, save on your whole stay,
            and the host throws in something extra as a welcome.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-cream border-2 border-foreground rounded-full px-4 py-2 shadow-hard-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-hand text-lg">{stays.length} deals refreshed today</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {stays.map((s, i) => (
          <article
            key={`${s.slug}-${s.startDate}`}
            className={cn(
              "polaroid text-left group transition-transform hover:-translate-y-1 block flex flex-col",
              i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
            )}
          >
            <div className="tape" />
            <div
              className={cn(
                "rounded-sm border-2 border-foreground p-4 flex flex-col justify-between relative overflow-hidden aspect-[4/3]",
                !s.image && "bg-gradient-to-br",
                !s.image && s.color,
              )}
            >
              {s.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              )}
              {s.image && <div className="absolute inset-0 bg-black/30 z-0" />}

              {/* Top overlay */}
              <div className="flex items-center justify-between relative z-10">
                <div className="bg-mustard border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold inline-flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Available {s.window}
                </div>
                <div className="bg-white/90 border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold inline-flex items-center gap-1">
                  <Star className="w-3 h-3 fill-mustard" /> {Number(s.rating).toFixed(1)}
                </div>
              </div>

              {/* Bottom overlay */}
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex flex-wrap gap-1">
                  {s.perks.map((p) => (
                    <span key={p} className="text-[10px] font-bold uppercase tracking-wider bg-white/90 border border-foreground rounded-full px-2 py-0.5">
                      + {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 px-1 flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <MapPin className="w-3 h-3" /> {s.neighborhood}
                </div>
                <div className="text-xs font-bold uppercase text-muted-foreground">
                  Host: {s.hostName}
                </div>
              </div>
              
              <p className="font-display font-extrabold text-2xl leading-tight mt-1">{s.name}</p>
              <p className="font-hand text-lg text-muted-foreground leading-tight">{s.tagline}</p>
              
              <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground line-through">€{s.originalPrice}</span>
                    <span className="font-display font-extrabold text-2xl text-accent">€{s.dealPrice}</span>
                    <span className="text-xs text-muted-foreground">/ night</span>
                  </div>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-10 font-bold hover:bg-primary/90"
                  onClick={() => {
                    if (!isAuthenticated) {
                      onAuthRequired?.();
                    } else {
                      window.open(`/stay/${s.slug}?flashDealStart=${s.startDate}&flashDealEnd=${s.endDate}&flashDealPrice=${s.dealPrice}`, "_blank");
                    }
                  }}
                >
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
