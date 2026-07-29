import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Sparkles, Calendar as CalendarIcon, Star, Waves } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";
import { Editable } from "../Editable";

type Props = { data: PropertyData; setData: (d: PropertyData) => void; editing: boolean };

export function TropicalTemplate({ data, setData, editing }: Props) {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const brand = data.brandColor || "#0D9488"; // teal default for tropical

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* HERO — full-bleed gradient */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${brand} 0%, #0f172a 100%)` }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: brand, transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: brand, transform: "translate(20%, 20%)" }} />

        {/* Logo */}
        {data.brandLogo && <img src={data.brandLogo} alt="Logo" className="h-16 mb-8 object-contain drop-shadow-lg z-10" />}

        <div className="relative z-10 max-w-3xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-75 mb-4">📍 {data.location || "Paradise awaits"}</p>
          <Editable
            value={data.name || "Your Tropical Retreat"}
            onChange={(v) => set("name", v)}
            editable={editing}
            as="h1"
            className="text-6xl sm:text-8xl font-black leading-none mb-6"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.3)" } as any}
          />
          <Editable
            value={data.tagline || "Wake up to paradise. Sleep under the stars."}
            onChange={(v) => set("tagline", v)}
            editable={editing}
            as="p"
            multiline
            className="text-xl opacity-90 leading-relaxed mb-10 max-w-xl mx-auto"
          />
          <Button
            onClick={() => document.getElementById("book-tropical")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white font-bold text-lg h-14 px-10 rounded-full shadow-2xl hover:scale-105 transition-transform"
            style={{ color: brand }}
          >
            <Sparkles className="w-5 h-5 mr-2" /> Book Your Stay
          </Button>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64 C360,120 1080,0 1440,80 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* WHY STAY */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: brand }}>🌴 The Experience</p>
            <h2 className="text-4xl font-black text-gray-900">What makes it special</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.specials.map((s, i) => (
              <div key={i} className="rounded-3xl p-8 text-center space-y-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-white text-2xl shadow-md" style={{ backgroundColor: brand }}>
                  {["🌊", "🌺", "🍹"][i]}
                </div>
                <Editable
                  value={s || "Something extraordinary awaits you here."}
                  onChange={(v) => { const next = [...data.specials]; next[i] = v; set("specials", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-gray-700 leading-relaxed font-medium"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20" style={{ backgroundColor: `${brand}0d` }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: brand }}>⭐ Guest Love</p>
            <h2 className="text-4xl font-black text-gray-900">What guests are saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.reviews.filter((r) => r.text.trim() || editing).map((r, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 shadow-md border border-white">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn("w-4 h-4", s < r.rating ? "text-transparent" : "text-gray-200")} style={s < r.rating ? { fill: brand } : {}} />
                  ))}
                </div>
                <Editable
                  value={r.text || "This place is absolute paradise — I never wanted to leave!"}
                  onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], text: v }; set("reviews", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-gray-700 leading-relaxed"
                />
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brand }}>
                    {(r.author || "G")[0]}
                  </div>
                  <Editable
                    value={r.author || "Happy Guest"}
                    onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], author: v }; set("reviews", next); }}
                    editable={editing}
                    as="p"
                    className="font-semibold text-gray-800 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOST */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl aspect-square flex items-center justify-center text-9xl shadow-xl"
            style={{ background: `linear-gradient(135deg, ${brand}33, ${brand}11)` }}>
            🌴
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: brand }}>Your Host</p>
            <Editable value={data.hostName || "Your Name"} onChange={(v) => set("hostName", v)} editable={editing} as="h2" className="text-4xl font-black text-gray-900" />
            <div className="mt-4 flex flex-wrap gap-2">
              {(data.hostInterests || "").split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: brand }}>{t}</span>
              ))}
            </div>
            <Editable
              value={data.hostLoves || "I love sharing the beauty of this place with guests from around the world."}
              onChange={(v) => set("hostLoves", v)}
              editable={editing}
              as="p"
              multiline
              className="mt-6 text-gray-600 leading-relaxed text-lg"
            />
          </div>
        </div>
      </section>

      {/* WAVE TRANSITION */}
      <div style={{ backgroundColor: `${brand}` }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full block rotate-180">
          <path d="M0,40 C360,80 1080,0 1440,50 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      {/* BOOKING */}
      <section id="book-tropical" className="py-20 text-white" style={{ backgroundColor: brand }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-75 mb-3">🗓 Your Dates</p>
            <h2 className="text-4xl font-black">Reserve Your Paradise</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {data.rooms.map((r, i) => (
                <button key={i} onClick={() => setSelectedRoom(i)}
                  className={cn("w-full text-left p-5 rounded-2xl border-2 transition-all", selectedRoom === i ? "border-white bg-white/20" : "border-white/30 hover:border-white/60")}>
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <p className="font-bold">{r.name || `Room ${i + 1}`}</p>
                      <p className="text-sm opacity-75">{r.amenities.slice(0, 3).join(" · ") || "Sleeps 2 · Private bathroom"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">€{r.price}</p>
                      <p className="text-xs opacity-75">/ night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="bg-white rounded-3xl p-7 text-gray-900 shadow-2xl space-y-4">
              <h3 className="font-bold text-lg">{data.rooms[selectedRoom]?.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <TropicalDatePicker label="Check In" date={checkIn} onChange={setCheckIn} brand={brand} />
                <TropicalDatePicker label="Check Out" date={checkOut} onChange={setCheckOut} minDate={checkIn} brand={brand} />
              </div>
              {checkIn && checkOut && (() => {
                const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
                const price = data.rooms[selectedRoom]?.price ?? 0;
                return (
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600"><span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span><span>€{price * nights}</span></div>
                    <div className="flex justify-between font-black text-gray-900 text-xl pt-2 border-t border-gray-100"><span>Total</span><span>€{price * nights}</span></div>
                  </div>
                );
              })()}
              <Button disabled={!checkIn || !checkOut}
                className="w-full h-13 font-bold rounded-2xl text-white text-base disabled:opacity-50"
                style={{ backgroundColor: brand }}>
                <Sparkles className="w-5 h-5 mr-2" /> Book Now
              </Button>
              <p className="text-center text-xs text-gray-400">No hidden fees. Direct booking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WAVE FOOTER */}
      <div style={{ backgroundColor: "#0f172a" }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full block rotate-180">
          <path d="M0,40 C360,80 1080,0 1440,50 L1440,80 L0,80 Z" fill={brand} />
        </svg>
        <div className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between text-white">
          <div>
            {data.brandLogo && <img src={data.brandLogo} alt="Logo" className="h-8 mb-2 object-contain brightness-0 invert" />}
            <p className="font-bold">{data.name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-60">
            <Waves className="w-4 h-4" />
            <span>© {new Date().getFullYear()} · {data.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TropicalDatePicker({ label, date, onChange, minDate, brand }: { label: string; date: Date | undefined; onChange: (d: Date | undefined) => void; minDate?: Date; brand: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 flex items-center gap-2 text-left text-sm", !date && "text-gray-400")}>
            <CalendarIcon className="w-4 h-4 shrink-0" style={{ color: brand }} />
            <span>{date ? format(date, "MMM d, yyyy") : "Select date"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-xl" align="start">
          <Calendar mode="single" selected={date} onSelect={onChange} disabled={minDate ? (d) => d <= minDate : undefined} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
