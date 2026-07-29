import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Sparkles, Calendar as CalendarIcon, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";
import { Editable } from "../Editable";

type Props = { data: PropertyData; setData: (d: PropertyData) => void; editing: boolean };

export function LuxuryTemplate({ data, setData, editing }: Props) {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const brand = data.brandColor || "#C9A84C"; // gold default for luxury

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0d0d0d", fontFamily: "'Georgia', serif" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-10 py-5" style={{ backgroundColor: "#0d0d0dcc", backdropFilter: "blur(12px)", borderBottom: `1px solid ${brand}33` }}>
        <div className="flex items-center gap-3">
          {data.brandLogo
            ? <img src={data.brandLogo} alt="Logo" className="h-8 object-contain" style={{ filter: `drop-shadow(0 0 8px ${brand}88)` }} />
            : <span className="text-lg font-bold tracking-widest uppercase" style={{ color: brand }}>{data.name || "Luxury Stay"}</span>
          }
        </div>
        <Button
          size="sm"
          onClick={() => document.getElementById("book-luxury")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-none border font-bold tracking-widest uppercase text-xs h-10 px-8 bg-transparent hover:text-black transition-colors"
          style={{ borderColor: brand, color: brand }}
        >
          Reserve
        </Button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden" style={{ paddingTop: "80px" }}>
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${brand}18 0%, transparent 70%)` }} />
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${brand} 0px, ${brand} 1px, transparent 1px, transparent 80px)` }} />

        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          {/* Ornamental divider */}
          <div className="flex items-center gap-4 justify-center mb-10">
            <div className="h-px w-16 opacity-50" style={{ backgroundColor: brand }} />
            <span className="text-xs tracking-[0.4em] uppercase opacity-50" style={{ color: brand }}>Est. {new Date().getFullYear()}</span>
            <div className="h-px w-16 opacity-50" style={{ backgroundColor: brand }} />
          </div>

          <p className="text-xs tracking-[0.4em] uppercase mb-6 opacity-60" style={{ color: brand }}>
            <Editable value={data.location || "An Exclusive Address"} onChange={(v) => set("location", v)} editable={editing} as="span" className="" />
          </p>
          <Editable
            value={data.name || "The Grand Estate"}
            onChange={(v) => set("name", v)}
            editable={editing}
            as="h1"
            className="text-5xl sm:text-7xl font-bold leading-tight mb-8"
            style={{ letterSpacing: "-0.02em", textShadow: `0 0 60px ${brand}33` } as any}
          />
          <div className="flex items-center gap-4 justify-center mb-8">
            <div className="h-px w-12 opacity-30" style={{ backgroundColor: brand }} />
            <div className="w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: brand }} />
            <div className="h-px w-12 opacity-30" style={{ backgroundColor: brand }} />
          </div>
          <Editable
            value={data.tagline || "Where every detail is a deliberate indulgence."}
            onChange={(v) => set("tagline", v)}
            editable={editing}
            as="p"
            multiline
            className="text-xl opacity-70 leading-relaxed max-w-lg mx-auto mb-12 italic"
          />
          <Button
            onClick={() => document.getElementById("book-luxury")?.scrollIntoView({ behavior: "smooth" })}
            className="h-14 px-12 text-sm tracking-widest uppercase font-bold bg-transparent border-2 hover:text-black transition-colors rounded-none"
            style={{ borderColor: brand, color: brand }}
          >
            <Sparkles className="w-4 h-4 mr-3" /> Reserve Your Suite
          </Button>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="flex items-center px-12 py-4">
        <div className="flex-1 h-px opacity-20" style={{ backgroundColor: brand }} />
        <div className="mx-6 text-2xl opacity-30" style={{ color: brand }}>✦</div>
        <div className="flex-1 h-px opacity-20" style={{ backgroundColor: brand }} />
      </div>

      {/* SPECIALS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-60" style={{ color: brand }}>The Distinction</p>
            <h2 className="text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>Curated Refinements</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: `${brand}20` }}>
            {data.specials.map((s, i) => (
              <div key={i} className="p-10 space-y-6" style={{ backgroundColor: "#0d0d0d" }}>
                <span className="text-5xl font-bold opacity-10" style={{ color: brand }}>0{i + 1}</span>
                <Editable
                  value={s || "An experience crafted for discerning guests."}
                  onChange={(v) => { const next = [...data.specials]; next[i] = v; set("specials", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-base leading-relaxed opacity-80 italic"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 px-6" style={{ backgroundColor: "#111" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-60" style={{ color: brand }}>Testimonials</p>
            <h2 className="text-4xl font-bold" style={{ letterSpacing: "-0.02em" }}>Guest Impressions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.reviews.filter((r) => r.text.trim() || editing).map((r, i) => (
              <div key={i} className="p-8 border opacity-90 hover:opacity-100 transition-opacity" style={{ borderColor: `${brand}33` }}>
                <div className="flex gap-1 mb-6" style={{ color: brand }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3 h-3" style={s < r.rating ? { fill: brand } : { fill: "transparent", stroke: brand, opacity: 0.3 }} />
                  ))}
                </div>
                <Editable
                  value={r.text || "An unparalleled level of service and attention to detail."}
                  onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], text: v }; set("reviews", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-sm leading-relaxed opacity-70 italic mb-6"
                />
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 opacity-20" style={{ backgroundColor: brand }} />
                  <Editable
                    value={r.author || "Distinguished Guest"}
                    onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], author: v }; set("reviews", next); }}
                    editable={editing}
                    as="p"
                    className="text-xs tracking-[0.2em] uppercase opacity-60"
                    style={{ color: brand } as any}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOST */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="border p-10 space-y-6" style={{ borderColor: `${brand}33` }}>
            <p className="text-xs tracking-[0.4em] uppercase opacity-60" style={{ color: brand }}>Your Host</p>
            <Editable value={data.hostName || "Your Name"} onChange={(v) => set("hostName", v)} editable={editing} as="h2" className="text-4xl font-bold" style={{ letterSpacing: "-0.02em" } as any} />
            <div className="flex flex-wrap gap-2">
              {(data.hostInterests || "").split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="text-xs tracking-[0.15em] uppercase border px-3 py-1.5" style={{ borderColor: `${brand}50`, color: brand }}>{t}</span>
              ))}
            </div>
            <Editable value={data.hostLoves || "Every detail has been chosen with care."} onChange={(v) => set("hostLoves", v)} editable={editing} as="p" multiline className="text-sm opacity-70 leading-relaxed italic" />
          </div>
          <div className="aspect-square flex items-center justify-center text-8xl opacity-20" style={{ border: `1px solid ${brand}33` }}>
            ◈
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book-luxury" className="py-24 px-6" style={{ backgroundColor: "#111" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase mb-4 opacity-60" style={{ color: brand }}>Reservations</p>
            <h2 className="text-4xl font-bold mb-2" style={{ letterSpacing: "-0.02em" }}>Select Your Suite</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-3">
              {data.rooms.map((r, i) => (
                <button key={i} onClick={() => setSelectedRoom(i)}
                  className={cn("w-full text-left p-6 border transition-all text-white", selectedRoom === i ? "border-current" : "border-white/10 hover:border-white/30")}
                  style={selectedRoom === i ? { borderColor: brand, backgroundColor: `${brand}10` } : {}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold tracking-wide">{r.name || `Suite ${i + 1}`}</p>
                      <p className="text-xs opacity-50 mt-1 tracking-wider">{r.amenities.slice(0, 3).join(" · ") || "Private · Ensuite · King Bed"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: brand }}>€{r.price}</p>
                      <p className="text-xs opacity-40">per night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border p-8 space-y-6" style={{ borderColor: `${brand}33` }}>
              <p className="font-bold tracking-wide">{data.rooms[selectedRoom]?.name}</p>
              <div className="grid grid-cols-2 gap-4">
                <LuxuryDatePicker label="Arrival" date={checkIn} onChange={setCheckIn} brand={brand} />
                <LuxuryDatePicker label="Departure" date={checkOut} onChange={setCheckOut} minDate={checkIn} brand={brand} />
              </div>
              {checkIn && checkOut && (() => {
                const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
                const price = data.rooms[selectedRoom]?.price ?? 0;
                return (
                  <div className="space-y-3 pt-4 border-t opacity-70" style={{ borderColor: `${brand}33` }}>
                    <div className="flex justify-between text-sm"><span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span><span>€{price * nights}</span></div>
                    <div className="flex justify-between font-bold text-xl pt-3 border-t" style={{ borderColor: `${brand}33`, color: brand }}><span>Total</span><span>€{price * nights}</span></div>
                  </div>
                );
              })()}
              <Button disabled={!checkIn || !checkOut}
                className="w-full h-12 font-bold tracking-widest uppercase text-xs bg-transparent border text-white hover:text-black transition-colors rounded-none disabled:opacity-30"
                style={{ borderColor: brand, color: brand }}>
                <Sparkles className="w-4 h-4 mr-3" /> Confirm Reservation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-10 py-10 flex items-center justify-between" style={{ borderColor: `${brand}20` }}>
        <div>
          {data.brandLogo && <img src={data.brandLogo} alt="Logo" className="h-6 mb-2 object-contain" style={{ filter: `brightness(0) saturate(100%) invert(80%) sepia(30%) hue-rotate(10deg)` }} />}
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: brand }}>{data.name}</p>
        </div>
        <p className="text-xs opacity-30 tracking-wider">© {new Date().getFullYear()} · {data.location}</p>
      </footer>
    </div>
  );
}

function LuxuryDatePicker({ label, date, onChange, minDate, brand }: { label: string; date: Date | undefined; onChange: (d: Date | undefined) => void; minDate?: Date; brand: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] uppercase opacity-50 mb-2" style={{ color: brand }}>{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("w-full h-11 border bg-transparent px-3 flex items-center gap-2 text-left text-sm", !date && "opacity-40")} style={{ borderColor: `${brand}40` }}>
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" style={{ color: brand }} />
            <span>{date ? format(date, "MMM d, yyyy") : "Select"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border shadow-2xl rounded-none" style={{ borderColor: `${brand}50`, backgroundColor: "#1a1a1a" }} align="start">
          <Calendar mode="single" selected={date} onSelect={onChange} disabled={minDate ? (d) => d <= minDate : undefined} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
