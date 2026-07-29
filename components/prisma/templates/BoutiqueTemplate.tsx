import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Sparkles, Calendar as CalendarIcon,
  Star, MapPin, Coffee, Sun, Waves, User, Heart,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";
import { Editable } from "../Editable";

const ILLUSTRATIONS = [Coffee, Sun, Waves];

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
  editing: boolean;
};

export function BoutiqueTemplate({ data, setData, editing }: Props) {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  // Use brandColor as CSS custom property inline
  const brand = data.brandColor || "#D96B43";

  return (
    <div className="min-h-screen" style={{ "--brand": brand } as React.CSSProperties}>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            {data.brandLogo && (
              <img src={data.brandLogo} alt="Logo" className="h-14 mb-6 object-contain" />
            )}
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-white px-3 py-1 shadow-hard-sm">
              <MapPin className="w-3.5 h-3.5" style={{ color: brand }} />
              <Editable
                value={data.location}
                onChange={(v) => set("location", v)}
                editable={editing}
                as="span"
                className="text-xs font-bold uppercase tracking-wider"
              />
            </div>
            <Editable
              value={data.name}
              onChange={(v) => set("name", v)}
              editable={editing}
              as="h1"
              className="mt-4 text-5xl sm:text-7xl font-display font-extrabold leading-[0.95]"
            />
            <Editable
              value={data.tagline || "A hand-made little world, ready for your arrival."}
              onChange={(v) => set("tagline", v)}
              editable={editing}
              as="p"
              multiline
              className="mt-5 text-lg text-muted-foreground max-w-md"
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => document.getElementById("book-boutique")?.scrollIntoView({ behavior: "smooth" })}
                className="text-white border-2 border-foreground shadow-hard rounded-xl h-12 px-6 text-base font-bold"
                style={{ backgroundColor: brand }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Book Direct
              </Button>
              <span className="font-hand text-2xl text-accent">no fees · real host ✿</span>
            </div>
          </div>

          {/* Hero visual collage */}
          <div className="relative h-[420px]">
            <div className="polaroid absolute top-2 left-4 w-56 rotate-[-6deg]">
              <div className="tape" />
              <div className="aspect-[4/5] rounded-sm flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brand}66, ${brand}99)` }}>
                <Sun className="w-16 h-16 text-white/90" strokeWidth={1.5} />
              </div>
              <p className="font-hand text-lg text-center mt-2">morning light ☀</p>
            </div>
            <div className="polaroid absolute top-16 right-2 w-52 rotate-[5deg]">
              <div className="tape" />
              <div className="aspect-square bg-gradient-to-br from-accent to-accent/50 rounded-sm flex items-center justify-center">
                <Waves className="w-14 h-14 text-white/90" strokeWidth={1.5} />
              </div>
              <p className="font-hand text-lg text-center mt-2">by the sea 🌊</p>
            </div>
            <div className="polaroid absolute bottom-0 left-1/2 -translate-x-1/2 w-56 rotate-[-2deg]">
              <div className="tape" />
              <div className="aspect-[5/4] rounded-sm flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brand}, ${brand}99)` }}>
                <Coffee className="w-14 h-14 text-white/90" strokeWidth={1.5} />
              </div>
              <p className="font-hand text-lg text-center mt-2">breakfast on the terrace</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORYBOARD */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="font-hand text-3xl text-accent">the storyboard</p>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">Three little reasons to love it</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {data.specials.map((s, i) => {
            const Icon = ILLUSTRATIONS[i % ILLUSTRATIONS.length];
            const rotate = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]"][i];
            return (
              <div key={i} className={cn("polaroid relative", rotate)}>
                <div className="tape" />
                <div className="aspect-[5/4] rounded-sm flex items-center justify-center border-2 border-foreground" style={{ backgroundColor: `${brand}22` }}>
                  <Icon className="w-16 h-16 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="mt-3 px-1">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: brand }}>N°0{i + 1}</p>
                  <Editable
                    value={s}
                    onChange={(v) => { const next = [...data.specials]; next[i] = v; set("specials", next); }}
                    editable={editing}
                    as="p"
                    multiline
                    className="mt-1 font-hand text-2xl leading-tight"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="text-accent-foreground border-y-2 border-foreground" style={{ backgroundColor: "#1D4E89" }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10">
            <p className="font-hand text-3xl text-mustard">how to find us</p>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white">Follow the crumbs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {data.directions.map((d, i) => (
              <div key={i} className="relative">
                <div className="bg-cream text-foreground hand-border p-6 relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full border-2 border-foreground shadow-hard-sm flex items-center justify-center text-white font-display font-extrabold text-xl" style={{ backgroundColor: brand }}>
                    {i + 1}
                  </div>
                  <Editable
                    value={d}
                    onChange={(v) => { const next = [...data.directions]; next[i] = v; set("directions", next); }}
                    editable={editing}
                    as="p"
                    multiline
                    className="pt-2 text-lg font-medium leading-snug"
                  />
                </div>
                {i < data.directions.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-mustard font-hand text-4xl select-none">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUEST LOVE */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="font-hand text-3xl" style={{ color: brand }}>guest love</p>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">Notes on the fridge</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {data.reviews.filter((r) => r.text.trim() || editing).map((r, i) => (
            <div key={i} className={cn("polaroid relative", ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1.5deg]"][i % 3])}>
              <div className="tape" />
              <div className="bg-cream/50 border-2 border-foreground p-5 min-h-[140px] flex items-center">
                <Editable
                  value={r.text || "Loved every second — the light, the coffee, the quiet."}
                  onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], text: v }; set("reviews", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="font-hand text-2xl leading-snug"
                />
              </div>
              <div className="mt-3 px-1 flex items-center justify-between">
                <Editable
                  value={r.author || "A happy guest"}
                  onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], author: v }; set("reviews", next); }}
                  editable={editing}
                  as="p"
                  className="font-display font-bold"
                />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn("w-4 h-4", s < r.rating ? "text-foreground" : "text-muted-foreground/40")} style={s < r.rating ? { fill: "#F2C83B" } : {}} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEET YOUR HOST */}
      <section className="border-y-2 border-foreground" style={{ backgroundColor: `${brand}22` }}>
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="relative w-48 h-48 mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-full border-2 border-foreground shadow-hard flex items-center justify-center" style={{ backgroundColor: brand }}>
              <User className="w-24 h-24 text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-cream border-2 border-foreground rounded-full px-3 py-1 shadow-hard-sm font-hand text-lg rotate-6">hi ✿</div>
          </div>
          <div>
            <p className="font-hand text-3xl" style={{ color: brand }}>meet your host</p>
            <Editable value={data.hostName || "Your name"} onChange={(v) => set("hostName", v)} editable={editing} as="h2" className="text-4xl sm:text-5xl font-display font-extrabold" />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(data.hostInterests || "").split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="bg-cream border-2 border-foreground rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider">{t}</span>
              ))}
            </div>
            <div className="mt-5 bg-cream hand-border p-5 max-w-xl">
              <p className="font-hand text-xl text-accent inline-flex items-center gap-1">
                <Heart className="w-4 h-4" style={{ fill: brand, color: brand }} /> what I love sharing
              </p>
              <Editable value={data.hostLoves || "The little corners I'd tell a friend about."} onChange={(v) => set("hostLoves", v)} editable={editing} as="p" multiline className="mt-1 text-base leading-snug" />
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book-boutique" className="bg-cream border-t-2 border-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <p className="font-hand text-3xl text-accent">instant booking</p>
            <h2 className="text-4xl sm:text-5xl font-display font-bold">Reserve your dates</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              {data.rooms.map((r, i) => (
                <button key={i} onClick={() => setSelectedRoom(i)}
                  className={cn("w-full text-left bg-card hand-border p-4 flex gap-4 items-center transition-transform", selectedRoom === i && "-translate-y-0.5")}
                  style={selectedRoom === i ? { backgroundColor: `${brand}22` } : {}}>
                  <div className="w-24 h-24 rounded-lg border-2 border-foreground overflow-hidden flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${brand}66, ${brand}33)` }}>
                    {r.photos[0] ? <img src={r.photos[0]} alt={r.name} className="w-full h-full object-cover" /> : <Sun className="w-8 h-8 text-white" strokeWidth={1.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-display font-bold truncate">{r.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{r.amenities.length > 0 ? r.amenities.slice(0, 3).join(" · ") : "Sleeps 2 · Private bathroom"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-display font-extrabold">€{r.price}</p>
                    <p className="text-xs text-muted-foreground">/ night</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="bg-card hand-border p-6 sticky top-24">
              <p className="font-hand text-2xl text-accent">your stay</p>
              <p className="text-2xl font-display font-bold mb-4">{data.rooms[selectedRoom]?.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <DatePickerField label="Check in" date={checkIn} onChange={setCheckIn} brand={brand} />
                <DatePickerField label="Check out" date={checkOut} onChange={setCheckOut} minDate={checkIn} brand={brand} />
              </div>
              <div className="mt-4 space-y-2 py-4 border-t-2 border-dashed border-foreground/30">
                {checkIn && checkOut ? (
                  <BookingSummary price={data.rooms[selectedRoom]?.price ?? 0} from={checkIn} to={checkOut} />
                ) : (
                  <p className="text-sm text-muted-foreground">Pick your dates to see the total.</p>
                )}
              </div>
              <Button disabled={!checkIn || !checkOut}
                className="w-full mt-4 text-white border-2 border-foreground shadow-hard rounded-xl h-14 text-lg font-bold disabled:opacity-50"
                style={{ backgroundColor: brand }}>
                <Sparkles className="w-5 h-5 mr-2" />
                Reserve Now
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">Direct with the host · free cancellation up to 7 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-foreground text-white" style={{ backgroundColor: brand }}>
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            {data.brandLogo && <img src={data.brandLogo} alt="Logo" className="h-8 mb-2 object-contain brightness-0 invert" />}
            <p className="font-display text-2xl font-extrabold">{data.name}</p>
            <p className="font-hand text-xl">made with ♡ on Prisma</p>
          </div>
          <p className="text-sm opacity-80">© {new Date().getFullYear()} · {data.location}</p>
        </div>
      </footer>
    </div>
  );
}

function DatePickerField({ label, date, onChange, minDate, brand }: { label: string; date: Date | undefined; onChange: (d: Date | undefined) => void; minDate?: Date; brand: string; }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider mb-1.5">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("w-full h-12 rounded-xl border-2 border-foreground shadow-hard-sm bg-white px-3 flex items-center gap-2 text-left", !date && "text-muted-foreground")}>
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium truncate">{date ? format(date, "MMM d, yyyy") : "Pick a date"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-2 border-foreground shadow-hard rounded-xl" align="start">
          <Calendar mode="single" selected={date} onSelect={onChange} disabled={minDate ? (d) => d <= minDate : undefined} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function BookingSummary({ price, from, to }: { price: number; from: Date; to: Date }) {
  const nights = Math.max(1, Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
  const total = price * nights;
  return (
    <>
      <div className="flex justify-between text-sm"><span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span><span>€{total}</span></div>
      <div className="flex justify-between text-sm text-muted-foreground"><span>Booking fees</span><span>€0</span></div>
      <div className="flex justify-between font-display font-extrabold text-xl mt-2 pt-2 border-t border-foreground/20"><span>Total</span><span>€{total}</span></div>
    </>
  );
}
