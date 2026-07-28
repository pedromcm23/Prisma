import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Wrench, Save, Sparkles, ArrowLeft, Calendar as CalendarIcon,
  Star, MapPin, Coffee, Sun, Waves, Copy, Check, User, Heart,
  Palette, Package,
} from "lucide-react";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";
import { Editable } from "./Editable";
import {
  THEME_PRESETS, brandKitCssVars, themeToBrandKit,
  type BrandKit, type ThemeId,
} from "@/lib/brand-kit";
import { BrandKitDrawer } from "./BrandKitDrawer";
import { BrandExportModal } from "./BrandExportModal";

const ILLUSTRATIONS = [Coffee, Sun, Waves];

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
  onBack?: () => void;
  onPublish?: (kit: BrandKit) => void;
  isPublishing?: boolean;
  readOnly?: boolean;
  initialBrandKit?: BrandKit;
};

export function BoutiqueSite({ data, setData, onBack, onPublish, isPublishing, readOnly }: Props) {
  const [editing, setEditing] = useState(!readOnly);
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [brandKit, setBrandKit] = useState<BrandKit>(() => initialBrandKit || themeToBrandKit("folk-pop"));
  const [brandOpen, setBrandOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const applyTheme = (id: ThemeId) =>
    setBrandKit(themeToBrandKit(id, brandKit.logoDataUrl));

  const slug = (data.name || "your-stay").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/stay/${slug}`
    : `/stay/${slug}`;

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });



  return (
    <div className="min-h-screen" style={brandKitCssVars(brandKit)}>
      {/* Sticky editor banner */}
      {!readOnly && (
        <div className="sticky top-0 z-40 bg-mustard border-b-2 border-foreground shadow-hard-sm">
          <div className="mx-auto max-w-6xl px-4 py-2.5 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span className="font-bold text-sm">🛠 Editor Mode {editing ? "Active" : "Paused"}</span>
            <span className="hidden sm:inline text-xs text-foreground/70">
              — click any text to edit
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onBack}
              className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-cream"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBrandOpen(true)}
              className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-cream"
            >
              <Palette className="w-4 h-4 mr-1" /> 🎨 Brand Kit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing((e) => !e)}
              className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-cream"
            >
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button
              size="sm"
              onClick={() => setExportOpen(true)}
              className="bg-accent text-accent-foreground border-2 border-foreground shadow-hard-sm rounded-lg h-9 hover:opacity-90"
            >
              <Package className="w-4 h-4 mr-1" /> 📦 Export Kit
            </Button>
            <Button
              size="sm"
              disabled={isPublishing}
              onClick={() => {
                if (onPublish) onPublish(brandKit);
              }}
              className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-lg h-9 hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-1" /> {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>
      )}

      {/* Theme switcher bar */}
      {!readOnly && (
        <div className="sticky top-[52px] z-30 bg-cream/95 backdrop-blur border-b-2 border-foreground">
          <div className="mx-auto max-w-6xl px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar items-center">
            <span className="text-xs font-bold text-muted-foreground mr-2 whitespace-nowrap">Try a Preset:</span>
          {THEME_PRESETS.map((t) => {
            const active = brandKit.themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-8 px-3 rounded-full border-2 border-foreground text-xs font-bold transition-transform",
                  active ? "shadow-hard-sm -translate-y-0.5" : "bg-white hover:bg-mustard/30",
                )}
                style={active ? { background: t.mustard, color: t.foreground } : undefined}
                title={t.label}
              >
                <span
                  className="w-3 h-3 rounded-full border border-foreground"
                  style={{ background: t.primary }}
                />
                <span
                  className="w-3 h-3 rounded-full border border-foreground -ml-1"
                  style={{ background: t.accent }}
                />
                <span>{t.emoji} {t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Main Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-white px-3 py-1 shadow-hard-sm">
              <MapPin className="w-3.5 h-3.5 text-primary" />
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
                onClick={() => {
                  document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-12 px-6 text-base font-bold hover:bg-primary/90"
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
              <div className="aspect-[4/5] bg-gradient-to-br from-mustard to-primary/60 rounded-sm flex items-center justify-center">
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
              <div className="aspect-[5/4] bg-gradient-to-br from-primary to-primary/60 rounded-sm flex items-center justify-center">
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
            const bg = ["bg-mustard/40", "bg-primary/25", "bg-accent/25"][i];
            return (
              <div key={i} className={cn("polaroid relative", rotate)}>
                <div className="tape" />
                <div className={cn("aspect-[5/4] rounded-sm flex items-center justify-center border-2 border-foreground", bg)}>
                  <Icon className="w-16 h-16 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="mt-3 px-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    N°0{i + 1}
                  </p>
                  <Editable
                    value={s}
                    onChange={(v) => {
                      const next = [...data.specials];
                      next[i] = v;
                      set("specials", next);
                    }}
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
      <section className="bg-accent text-accent-foreground border-y-2 border-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10">
            <p className="font-hand text-3xl text-mustard">how to find us</p>
            <h2 className="text-4xl sm:text-5xl font-display font-bold">Follow the crumbs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {data.directions.map((d, i) => (
              <div key={i} className="relative">
                <div className="bg-cream text-foreground hand-border p-6 relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center text-primary-foreground font-display font-extrabold text-xl">
                    {i + 1}
                  </div>
                  <Editable
                    value={d}
                    onChange={(v) => {
                      const next = [...data.directions];
                      next[i] = v;
                      set("directions", next);
                    }}
                    editable={editing}
                    as="p"
                    multiline
                    className="pt-2 text-lg font-medium leading-snug"
                  />
                </div>
                {i < data.directions.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-mustard font-hand text-4xl select-none">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <Editable
              value={data.location}
              onChange={(v) => set("location", v)}
              editable={editing}
              as="span"
              className="font-hand text-xl text-mustard"
            />
          </div>
        </div>
      </section>

      {/* GUEST LOVE */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="font-hand text-3xl text-primary">guest love</p>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">Notes on the fridge</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {data.reviews.filter((r) => r.text.trim() || editing).map((r, i) => (
            <div
              key={i}
              className={cn(
                "polaroid relative",
                ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1.5deg]"][i % 3],
              )}
            >
              <div className="tape" />
              <div className="bg-cream/50 border-2 border-foreground p-5 min-h-[140px] flex items-center">
                <Editable
                  value={r.text || "Loved every second — the light, the coffee, the quiet."}
                  onChange={(v) => {
                    const next = [...data.reviews];
                    next[i] = { ...next[i], text: v };
                    set("reviews", next);
                  }}
                  editable={editing}
                  as="p"
                  multiline
                  className="font-hand text-2xl leading-snug"
                />
              </div>
              <div className="mt-3 px-1 flex items-center justify-between">
                <Editable
                  value={r.author || "A happy guest"}
                  onChange={(v) => {
                    const next = [...data.reviews];
                    next[i] = { ...next[i], author: v };
                    set("reviews", next);
                  }}
                  editable={editing}
                  as="p"
                  className="font-display font-bold"
                />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-4 h-4",
                        s < r.rating ? "fill-mustard text-foreground" : "text-muted-foreground/40",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEET YOUR HOST */}
      <section className="border-y-2 border-foreground bg-mustard/40">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="relative w-48 h-48 mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-full bg-primary border-2 border-foreground shadow-hard flex items-center justify-center">
              <User className="w-24 h-24 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-cream border-2 border-foreground rounded-full px-3 py-1 shadow-hard-sm font-hand text-lg rotate-6">
              hi ✿
            </div>
          </div>
          <div>
            <p className="font-hand text-3xl text-primary">meet your host</p>
            <Editable
              value={data.hostName || "Your name"}
              onChange={(v) => set("hostName", v)}
              editable={editing}
              as="h2"
              className="text-4xl sm:text-5xl font-display font-extrabold"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(data.hostInterests || "").split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                <span key={i} className="bg-cream border-2 border-foreground rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                  {t}
                </span>
              ))}
              {editing && (
                <Editable
                  value={data.hostInterests || "Add your passions"}
                  onChange={(v) => set("hostInterests", v)}
                  editable={editing}
                  as="span"
                  className="text-xs text-muted-foreground italic ml-2 self-center"
                />
              )}
            </div>
            <div className="mt-5 bg-cream hand-border p-5 max-w-xl">
              <p className="font-hand text-xl text-accent inline-flex items-center gap-1">
                <Heart className="w-4 h-4 fill-primary text-primary" /> what I love sharing
              </p>
              <Editable
                value={data.hostLoves || "The little corners I'd tell a friend about."}
                onChange={(v) => set("hostLoves", v)}
                editable={editing}
                as="p"
                multiline
                className="mt-1 text-base leading-snug"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book" className="bg-cream border-t-2 border-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">

          <div className="mb-10 text-center">
            <p className="font-hand text-3xl text-accent">instant booking</p>
            <h2 className="text-4xl sm:text-5xl font-display font-bold">Reserve your dates</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Rooms */}
            <div className="space-y-4">
              {data.rooms.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedRoom(i)}
                  className={cn(
                    "w-full text-left bg-card hand-border p-4 flex gap-4 items-center transition-transform",
                    selectedRoom === i && "bg-mustard/30 -translate-y-0.5",
                  )}
                >
                  <div className="w-24 h-24 rounded-lg border-2 border-foreground overflow-hidden bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center shrink-0">
                    {r.photos[0] ? (
                      <img src={r.photos[0]} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sun className="w-8 h-8 text-white" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Editable
                      value={r.name}
                      onChange={(v) => {
                        const next = [...data.rooms];
                        next[i] = { ...next[i], name: v };
                        set("rooms", next);
                      }}
                      editable={editing}
                      as="h3"
                      className="text-xl font-display font-bold truncate"
                    />
                    <p className="text-sm text-muted-foreground truncate">
                      {r.amenities.length > 0 ? r.amenities.slice(0, 3).join(" · ") : "Sleeps 2 · Private bathroom"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-xs text-muted-foreground">€</span>
                      {editing ? (
                        <Input
                          type="number"
                          value={r.price}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const next = [...data.rooms];
                            next[i] = { ...next[i], price: Number(e.target.value) };
                            set("rooms", next);
                          }}
                          className="w-20 h-8 text-xl font-bold text-right border-2 border-foreground rounded-md"
                        />
                      ) : (
                        <span className="text-2xl font-display font-extrabold">{r.price}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">/ night</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Booking widget */}
            <div className="bg-card hand-border p-6 sticky top-24">
              <p className="font-hand text-2xl text-accent">your stay</p>
              <p className="text-2xl font-display font-bold mb-4">{data.rooms[selectedRoom]?.name}</p>

              <div className="grid grid-cols-2 gap-3">
                <DatePickerField label="Check in" date={checkIn} onChange={setCheckIn} />
                <DatePickerField label="Check out" date={checkOut} onChange={setCheckOut} minDate={checkIn} />
              </div>

              <div className="mt-4 space-y-2 py-4 border-t-2 border-dashed border-foreground/30">
                {checkIn && checkOut ? (
                  <BookingSummary
                    price={data.rooms[selectedRoom]?.price ?? 0}
                    from={checkIn}
                    to={checkOut}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Pick your dates to see the total.</p>
                )}
              </div>

              <Button
                disabled={!checkIn || !checkOut}
                className="w-full mt-4 bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-14 text-lg font-bold hover:bg-primary/90 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Reserve Now
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Direct with the host · free cancellation up to 7 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-foreground bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-extrabold">{data.name}</p>
            <p className="font-hand text-xl">made with ♡ on Prisma</p>
          </div>
          <p className="text-sm opacity-80">© {new Date().getFullYear()} · {data.location}</p>
        </div>
      </footer>

      {/* Publish modal */}
      <Dialog open={showPublish} onOpenChange={setShowPublish}>
        <DialogContent className="border-2 border-foreground shadow-hard-lg rounded-2xl bg-cream">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">🎉 You're live!</DialogTitle>
            <DialogDescription>
              Your boutique website is published. Share this direct-booking link anywhere — Instagram bio, WhatsApp, replies to Airbnb inquiries.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="border-2 border-foreground shadow-hard-sm rounded-xl h-12 font-mono text-sm bg-white"
              />
              <Button
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-xl h-12 px-4 hover:bg-primary/90"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-foreground/40 bg-mustard/30">
              <p className="font-hand text-2xl">next little steps ✿</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Add your logo & real photos</li>
                <li>• Connect your payment provider</li>
                <li>• Point your custom domain here</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BrandKitDrawer open={brandOpen} onOpenChange={setBrandOpen} kit={brandKit} setKit={setBrandKit} />
      <BrandExportModal open={exportOpen} onOpenChange={setExportOpen} kit={brandKit} data={data} shareUrl={shareUrl} />
    </div>

  );
}

function DatePickerField({
  label, date, onChange, minDate,
}: {
  label: string;
  date: Date | undefined;
  onChange: (d: Date | undefined) => void;
  minDate?: Date;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider mb-1.5">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full h-12 rounded-xl border-2 border-foreground shadow-hard-sm bg-white px-3 flex items-center gap-2 text-left",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium truncate">
              {date ? format(date, "MMM d, yyyy") : "Pick a date"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-2 border-foreground shadow-hard rounded-xl" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onChange}
            disabled={minDate ? (d) => d <= minDate : undefined}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
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
      <div className="flex justify-between text-sm">
        <span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span>
        <span>€{total}</span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Booking fees</span>
        <span>€0</span>
      </div>
      <div className="flex justify-between font-display font-extrabold text-xl mt-2 pt-2 border-t border-foreground/20">
        <span>Total</span>
        <span>€{total}</span>
      </div>
    </>
  );
}
