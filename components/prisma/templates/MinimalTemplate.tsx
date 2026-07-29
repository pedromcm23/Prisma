import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Sparkles, Calendar as CalendarIcon, Star, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";
import { Editable } from "../Editable";

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
  editing: boolean;
};

export function MinimalTemplate({ data, setData, editing }: Props) {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const brand = data.brandColor || "#2B2B2B";

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {data.brandLogo
            ? <img src={data.brandLogo} alt="Logo" className="h-8 object-contain" />
            : <span className="font-semibold tracking-tight text-lg" style={{ color: brand }}>{data.name || "Your Stay"}</span>
          }
        </div>
        <Button
          size="sm"
          onClick={() => document.getElementById("book-minimal")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-full px-5 text-white text-sm font-medium"
          style={{ backgroundColor: brand }}
        >
          Book Direct
        </Button>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: brand }}>
            <Editable value={data.location} onChange={(v) => set("location", v)} editable={editing} as="span" className="" />
          </p>
          <Editable
            value={data.name || "Your Property Name"}
            onChange={(v) => set("name", v)}
            editable={editing}
            as="h1"
            className="text-6xl sm:text-8xl font-black leading-none tracking-tight text-gray-900"
          />
          <div className="w-16 h-1 mt-8 mb-8 rounded-full" style={{ backgroundColor: brand }} />
          <Editable
            value={data.tagline || "A perfectly curated retreat for those who appreciate the details."}
            onChange={(v) => set("tagline", v)}
            editable={editing}
            as="p"
            multiline
            className="text-xl text-gray-500 leading-relaxed max-w-lg"
          />
          <div className="mt-10 flex items-center gap-4">
            <Button
              onClick={() => document.getElementById("book-minimal")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full px-8 h-12 text-white font-semibold text-base"
              style={{ backgroundColor: brand }}
            >
              <Sparkles className="w-4 h-4 mr-2" /> Reserve Now
            </Button>
            <ArrowDown className="w-5 h-5 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* SPECIALS */}
      <section className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-12" style={{ color: brand }}>Why guests love it</p>
          <div className="grid md:grid-cols-3 gap-12">
            {data.specials.map((s, i) => (
              <div key={i} className="space-y-3">
                <span className="text-4xl font-black text-gray-100">0{i + 1}</span>
                <Editable
                  value={s || "Something magical about this place."}
                  onChange={(v) => { const next = [...data.specials]; next[i] = v; set("specials", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-lg text-gray-700 leading-snug"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-t border-gray-100" style={{ backgroundColor: `${brand}08` }}>
        <div className="max-w-5xl mx-auto px-8 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-12" style={{ color: brand }}>Guest Reviews</p>
          <div className="grid md:grid-cols-3 gap-8">
            {data.reviews.filter((r) => r.text.trim() || editing).map((r, i) => (
              <div key={i} className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={cn("w-3.5 h-3.5", s < r.rating ? "text-transparent" : "text-gray-200")} style={s < r.rating ? { fill: brand } : {}} />
                  ))}
                </div>
                <Editable
                  value={r.text || "An exceptional experience from start to finish."}
                  onChange={(v) => { const next = [...data.reviews]; next[i] = { ...next[i], text: v }; set("reviews", next); }}
                  editable={editing}
                  as="p"
                  multiline
                  className="text-gray-700 leading-relaxed text-sm"
                />
                <p className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <Editable
                    value={r.author || "Happy Guest"}
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
      <section className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: brand }}>Your Host</p>
            <Editable value={data.hostName || "Your Name"} onChange={(v) => set("hostName", v)} editable={editing} as="h2" className="text-4xl font-black text-gray-900" />
            <div className="mt-4 flex flex-wrap gap-2">
              {(data.hostInterests || "").split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border" style={{ borderColor: brand, color: brand }}>{t}</span>
              ))}
            </div>
            <Editable
              value={data.hostLoves || "I love sharing the hidden gems of this neighbourhood with guests."}
              onChange={(v) => set("hostLoves", v)}
              editable={editing}
              as="p"
              multiline
              className="mt-6 text-gray-600 leading-relaxed"
            />
          </div>
          <div className="w-full aspect-square rounded-3xl flex items-center justify-center text-8xl" style={{ backgroundColor: `${brand}15` }}>
            🏡
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book-minimal" className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: brand }}>Book Direct</p>
          <h2 className="text-4xl font-black text-gray-900 mb-12">Reserve Your Dates</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-3">
              {data.rooms.map((r, i) => (
                <button key={i} onClick={() => setSelectedRoom(i)}
                  className={cn("w-full text-left p-5 rounded-2xl border-2 transition-all", selectedRoom === i ? "border-current shadow-lg" : "border-gray-200 hover:border-gray-300")}
                  style={selectedRoom === i ? { borderColor: brand, backgroundColor: `${brand}08` } : {}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{r.name || `Room ${i + 1}`}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">{r.amenities.slice(0, 3).join(" · ") || "Sleeps 2 · Private bathroom"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: brand }}>€{r.price}</p>
                      <p className="text-xs text-gray-400">/ night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm sticky top-24 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">{data.rooms[selectedRoom]?.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                <MinimalDatePicker label="Check in" date={checkIn} onChange={setCheckIn} brand={brand} />
                <MinimalDatePicker label="Check out" date={checkOut} onChange={setCheckOut} minDate={checkIn} brand={brand} />
              </div>
              {checkIn && checkOut && (() => {
                const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
                const price = data.rooms[selectedRoom]?.price ?? 0;
                return (
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600"><span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span><span>€{price * nights}</span></div>
                    <div className="flex justify-between font-black text-gray-900 text-lg pt-2 border-t border-gray-100"><span>Total</span><span>€{price * nights}</span></div>
                  </div>
                );
              })()}
              <Button disabled={!checkIn || !checkOut}
                className="w-full h-12 text-white font-semibold rounded-xl disabled:opacity-50"
                style={{ backgroundColor: brand }}>
                <Sparkles className="w-4 h-4 mr-2" /> Reserve Now
              </Button>
              <p className="text-center text-xs text-gray-400">No platform fees. Book direct.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-8 py-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} · {data.location}</p>
        </div>
      </footer>
    </div>
  );
}

function MinimalDatePicker({ label, date, onChange, minDate, brand }: { label: string; date: Date | undefined; onChange: (d: Date | undefined) => void; minDate?: Date; brand: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("w-full h-11 rounded-xl border border-gray-200 bg-white px-3 flex items-center gap-2 text-left text-sm", !date && "text-gray-400")}>
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span>{date ? format(date, "MMM d, yyyy") : "Pick a date"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-xl" align="start">
          <Calendar mode="single" selected={date} onSelect={onChange} disabled={minDate ? (d) => d <= minDate : undefined} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
