import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Sparkles, Calendar as CalendarIcon, Star, Flame } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";
import { Editable } from "../Editable";

type Props = { data: PropertyData; setData: (d: PropertyData) => void; editing: boolean };

export function RusticTemplate({ data, setData, editing }: Props) {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const brand = data.brandColor || "#8B4513"; // saddle brown default for rustic

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5ECD7", fontFamily: "'Georgia', serif", color: "#3D2314" }}>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${brand}dd 0%, #3D2314 100%)` }}>

        {/* Wood grain texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)`,
          backgroundSize: "4px 4px"
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="text-white">
            {data.brandLogo && <img src={data.brandLogo} alt="Logo" className="h-14 mb-8 object-contain brightness-0 invert" />}

            <div className="inline-flex items-center gap-2 mb-4 opacity-75">
              <Flame className="w-4 h-4" style={{ color: "#F2C83B" }} />
              <span className="text-sm tracking-widest uppercase font-semibold" style={{ color: "#F2C83B" }}>
                <Editable value={data.location || "The Wilderness"} onChange={(v) => set("location", v)} editable={editing} as="span" className="" />
              </span>
            </div>

            <Editable
              value={data.name || "The Cabin Retreat"}
              onChange={(v) => set("name", v)}
              editable={editing}
              as="h1"
              className="text-5xl sm:text-7xl font-bold leading-none mb-6"
              style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.3)" } as any}
            />
            <Editable
              value={data.tagline || "Unplug. Breathe. Rediscover simple pleasures."}
              onChange={(v) => set("tagline", v)}
              editable={editing}
              as="p"
              multiline
              className="text-lg opacity-80 leading-relaxed mb-10 italic"
            />
            <Button
              onClick={() => document.getElementById("book-rustic")?.scrollIntoView({ behavior: "smooth" })}
              className="h-13 px-8 font-bold text-base rounded-none border-2 border-white/40 bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" /> Find Your Escape
            </Button>
          </div>

          <div className="relative hidden md:block">
            {/* Stacked polaroid-style cabin illustrations */}
            <div className="relative w-full aspect-square">
              <div className="absolute inset-4 bg-white/10 rounded-sm border border-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-8xl">🏕️</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-sm border border-white/20 flex items-center justify-center">
                <span className="text-4xl">🌲</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALS */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: brand }}>🪵 The Essence</p>
            <h2 className="text-4xl font-bold" style={{ color: "#3D2314" }}>Life's better in the wild</h2>
            <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: brand }} />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.specials.map((s, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border-2" style={{ backgroundColor: "#EDD9B0", borderColor: `${brand}44` }}>
                <div className="text-4xl mb-4">{["🔥", "🌿", "⭐"][i]}</div>
                <Editable
                  value={s || "A simple pleasure worth savouring."}
                  onChange={(v) => { const next = [...data.specials]; next[i] = v; set("specials", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-base leading-relaxed italic"
                  style={{ color: "#3D2314" } as any}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="py-20 border-y-2" style={{ backgroundColor: brand, borderColor: "#3D2314" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="mb-12">
            <p className="font-bold uppercase tracking-[0.2em] text-sm mb-2" style={{ color: "#F2C83B" }}>Follow the trail</p>
            <h2 className="text-4xl font-bold text-white">How to reach us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.directions.map((d, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6 border border-white/20 text-white">
                <span className="text-4xl font-bold opacity-30 block mb-3">0{i + 1}</span>
                <Editable
                  value={d || "Follow the winding path."}
                  onChange={(v) => { const next = [...data.directions]; next[i] = v; set("directions", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-base opacity-90 italic leading-snug"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20" style={{ backgroundColor: "#EDD9B0" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: brand }}>Campfire Stories</p>
            <h2 className="text-4xl font-bold" style={{ color: "#3D2314" }}>What guests say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.reviews.filter((r) => r.text.trim() || editing).map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-md border" style={{ borderColor: `${brand}22` }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn("w-4 h-4", s < r.rating ? "text-transparent" : "text-gray-200")} style={s < r.rating ? { fill: brand } : {}} />
                  ))}
                </div>
                <Editable
                  value={r.text || "The most peaceful weekend I've had in years."}
                  onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], text: v }; set("reviews", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="italic leading-relaxed text-base"
                  style={{ color: "#5C3D1E" } as any}
                />
                <p className="mt-4 font-bold text-sm" style={{ color: brand }}>
                  — <Editable
                    value={r.author || "A Nature Lover"}
                    onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], author: v }; set("reviews", next); }}
                    editable={editing}
                    as="span"
                    className=""
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOST */}
      <section className="py-20 border-t-2" style={{ borderColor: `${brand}33` }}>
        <div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square rounded-3xl flex items-center justify-center text-9xl shadow-xl border-2"
            style={{ backgroundColor: "#EDD9B0", borderColor: `${brand}33` }}>
            🤠
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: brand }}>Your Host</p>
            <Editable value={data.hostName || "Your Name"} onChange={(v) => set("hostName", v)} editable={editing} as="h2" className="text-4xl font-bold" style={{ color: "#3D2314" } as any} />
            <div className="mt-4 flex flex-wrap gap-2">
              {(data.hostInterests || "").split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full border-2 text-white" style={{ borderColor: brand, backgroundColor: brand }}>{t}</span>
              ))}
            </div>
            <Editable
              value={data.hostLoves || "Sharing the peace and magic of this land with every guest."}
              onChange={(v) => set("hostLoves", v)}
              editable={editing}
              as="p"
              multiline
              className="mt-6 text-lg italic leading-relaxed"
              style={{ color: "#5C3D1E" } as any}
            />
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book-rustic" className="py-20" style={{ backgroundColor: "#3D2314" }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#F2C83B" }}>Book Your Escape</p>
            <h2 className="text-4xl font-bold text-white">Reserve Your Cabin</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-3">
              {data.rooms.map((r, i) => (
                <button key={i} onClick={() => setSelectedRoom(i)}
                  className={cn("w-full text-left p-5 rounded-xl border-2 transition-all text-white", selectedRoom === i ? "border-current" : "border-white/20 hover:border-white/40")}
                  style={selectedRoom === i ? { borderColor: "#F2C83B", backgroundColor: "rgba(255,255,255,0.05)" } : {}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{r.name || `Cabin ${i + 1}`}</p>
                      <p className="text-sm opacity-60 mt-0.5">{r.amenities.slice(0, 3).join(" · ") || "Fireplace · Queen Bed · Porch"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: "#F2C83B" }}>€{r.price}</p>
                      <p className="text-xs opacity-40">/ night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl p-7 space-y-5" style={{ backgroundColor: "#F5ECD7" }}>
              <p className="font-bold text-lg" style={{ color: "#3D2314" }}>{data.rooms[selectedRoom]?.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <RusticDatePicker label="Arrival" date={checkIn} onChange={setCheckIn} brand={brand} />
                <RusticDatePicker label="Departure" date={checkOut} onChange={setCheckOut} minDate={checkIn} brand={brand} />
              </div>
              {checkIn && checkOut && (() => {
                const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
                const price = data.rooms[selectedRoom]?.price ?? 0;
                return (
                  <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${brand}33` }}>
                    <div className="flex justify-between text-sm" style={{ color: "#5C3D1E" }}><span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span><span>€{price * nights}</span></div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t" style={{ borderColor: `${brand}33`, color: "#3D2314" }}><span>Total</span><span>€{price * nights}</span></div>
                  </div>
                );
              })()}
              <Button disabled={!checkIn || !checkOut}
                className="w-full h-12 font-bold text-white rounded-xl disabled:opacity-50"
                style={{ backgroundColor: brand }}>
                <Sparkles className="w-4 h-4 mr-2" /> Reserve Your Spot
              </Button>
              <p className="text-center text-xs" style={{ color: `${brand}88` }}>Book direct · No platform fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-4 px-8 py-10 flex items-center justify-between" style={{ borderColor: brand, backgroundColor: "#2A180D" }}>
        <div>
          {data.brandLogo && <img src={data.brandLogo} alt="Logo" className="h-8 mb-2 object-contain brightness-0 invert" />}
          <p className="font-bold text-white">{data.name}</p>
          <p className="text-xs opacity-40 text-white">made with ♡ on Prisma</p>
        </div>
        <p className="text-xs opacity-40 text-white">© {new Date().getFullYear()} · {data.location}</p>
      </footer>
    </div>
  );
}

function RusticDatePicker({ label, date, onChange, minDate, brand }: { label: string; date: Date | undefined; onChange: (d: Date | undefined) => void; minDate?: Date; brand: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: brand }}>{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("w-full h-11 rounded-lg border-2 bg-white px-3 flex items-center gap-2 text-left text-sm", !date && "text-gray-400")} style={{ borderColor: `${brand}55` }}>
            <CalendarIcon className="w-4 h-4 shrink-0" style={{ color: brand }} />
            <span>{date ? format(date, "MMM d, yyyy") : "Pick a date"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-2 shadow-xl rounded-xl" style={{ borderColor: `${brand}55` }} align="start">
          <Calendar mode="single" selected={date} onSelect={onChange} disabled={minDate ? (d) => d <= minDate : undefined} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
