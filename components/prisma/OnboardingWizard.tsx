import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sparkles, ArrowRight, ArrowLeft, Plus, Trash2, Upload, X, Star, Link2, Heart,
} from "lucide-react";
import type { PropertyData, RoomType } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";
import { generatePropertyCopy } from "@/app/actions/ai";

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
  onGenerate: () => void;
};

const AMENITY_SUGGESTIONS = ["Wi-Fi", "Terrace", "Kitchen", "Sea view", "Balcony", "Pool", "AC", "Bathtub", "Pets ok"];

export function OnboardingWizard({ data, setData, onGenerate }: Props) {
  const [step, setStep] = useState(1);
  const [importing, setImporting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const total = 4;

  const update = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  const updateRoom = (i: number, patch: Partial<RoomType>) => {
    const next = [...data.rooms];
    next[i] = { ...next[i], ...patch };
    update("rooms", next);
  };

  const canNext =
    (step === 1 && data.name.trim() && data.location.trim() && data.rooms.length > 0) ||
    (step === 2 && data.specials.every((s) => s.trim())) ||
    step === 3 ||
    step === 4;

  const simulateImport = async () => {
    if (!data.importUrl.trim()) {
      toast.error("Paste a Google Maps or Airbnb URL first");
      return;
    }
    setImporting(true);
    await new Promise((r) => setTimeout(r, 1400));
    const imported = [
      { text: "Absolutely magical. The host left fresh figs and hand-drawn maps to their favorite spots.", author: "Elena, Barcelona", rating: 5 },
      { text: "You can feel the love in every corner. Best coffee I've had on a terrace, ever.", author: "Tomás, São Paulo", rating: 5 },
      { text: "Booked for 2 nights, extended to 5. That says everything.", author: "Aiko, Tokyo", rating: 5 },
    ];
    update("reviews", imported);
    setImporting(false);
    toast.success("✨ Imported 3 verified guest reviews");
  };

  const handleMagicWrite = async () => {
    if (!data.name || !data.location) {
      toast.error("Please enter a name and location first");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const res = await generatePropertyCopy(data.name, data.location);
      if (res.success && res.data) {
        setData({
          ...data,
          tagline: res.data.tagline,
          specials: res.data.specials,
        });
        toast.success("✨ Tagline and specials generated!");
      } else {
        toast.error(res.error || "Failed to generate copy");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-foreground">Prisma</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          A hand-crafted direct-booking site for your boutique stay — in four little steps.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-card hand-border p-6 sm:p-10 relative">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full border-2 border-foreground flex items-center justify-center font-bold text-sm shadow-hard-sm ${
                  n <= step ? "bg-primary text-primary-foreground" : "bg-cream text-foreground"
                }`}
              >
                {n}
              </div>
              {n < 4 && (
                <div className={`h-1 flex-1 rounded-full ${n < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="font-hand text-2xl text-accent">Step {step} of {total}</p>
          <h2 className="text-3xl font-display font-bold">
            {step === 1 && "Rooms, photos & views"}
            {step === 2 && "The magic ingredients"}
            {step === 3 && "Meet the host"}
            {step === 4 && "Guests love you — prove it"}
          </h2>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Property name</Label>
                <Input id="name" value={data.name} onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Casa Amarela"
                  className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl h-12" />
              </div>
              <div>
                <Label htmlFor="loc">Location</Label>
                <Input id="loc" value={data.location} onChange={(e) => update("location", e.target.value)}
                  placeholder="e.g. Alfama, Lisbon"
                  className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl h-12" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tag">Short tagline (optional)</Label>
                <Button type="button" size="sm" variant="ghost" onClick={handleMagicWrite} disabled={isGeneratingAI || !data.name || !data.location} className="h-7 px-2 text-accent hover:text-accent/80 hover:bg-accent/10">
                  <Sparkles className="w-3 h-3 mr-1" /> {isGeneratingAI ? "Writing..." : "Magic Write"}
                </Button>
              </div>
              <Input id="tag" value={data.tagline} onChange={(e) => update("tagline", e.target.value)}
                placeholder="A sunlit hideaway on the old cobbled hill"
                className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl h-12" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Room setup & photos</Label>
                <Button type="button" size="sm" variant="outline"
                  onClick={() =>
                    update("rooms", [...data.rooms, { name: "", price: data.basePrice, amenities: [], photos: [] }])
                  }
                  className="border-2 border-foreground shadow-hard-sm rounded-lg">
                  <Plus className="w-4 h-4 mr-1" /> Add room
                </Button>
              </div>
              <div className="space-y-4">
                {data.rooms.map((r, i) => (
                  <RoomCard
                    key={i}
                    room={r}
                    onChange={(patch) => updateRoom(i, patch)}
                    onRemove={data.rooms.length > 1 ? () => update("rooms", data.rooms.filter((_, j) => j !== i)) : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between -mt-2">
              <p className="text-muted-foreground">
                Three tiny, specific things that make guests fall in love. Sensory & concrete always beats generic.
              </p>
              <Button type="button" size="sm" variant="ghost" onClick={handleMagicWrite} disabled={isGeneratingAI || !data.name || !data.location} className="h-7 px-2 text-accent hover:text-accent/80 hover:bg-accent/10 shrink-0">
                <Sparkles className="w-3 h-3 mr-1" /> {isGeneratingAI ? "Writing..." : "Auto-Fill"}
              </Button>
            </div>
            {data.specials.map((s, i) => (
              <div key={i}>
                <Label>Special #{i + 1}</Label>
                <Textarea value={s}
                  onChange={(e) => {
                    const next = [...data.specials]; next[i] = e.target.value; update("specials", next);
                  }}
                  placeholder={[
                    "Homemade sourdough breakfast on the terrace",
                    "Sunlit terracotta terrace with lemon trees",
                    "Secret beach path just 5 minutes away",
                  ][i]}
                  className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl min-h-[70px]" />
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <p className="text-muted-foreground -mt-2">
              Guests book people, not walls. Share a little about yourself and what you love in your neighborhood.
            </p>
            <div>
              <Label htmlFor="hostname">Your name</Label>
              <Input id="hostname" value={data.hostName}
                onChange={(e) => update("hostName", e.target.value)}
                placeholder="Ana"
                className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl h-12" />
            </div>
            <div>
              <Label htmlFor="interests">Your interests & passions</Label>
              <Input id="interests" value={data.hostInterests}
                onChange={(e) => update("hostInterests", e.target.value)}
                placeholder="Surfing, Natural Wine, Local Pottery"
                className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl h-12" />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated, shown as little badges.</p>
            </div>
            <div>
              <Label htmlFor="loves">What I love sharing with guests</Label>
              <Textarea id="loves" value={data.hostLoves}
                onChange={(e) => update("hostLoves", e.target.value)}
                placeholder="Secret sunset spot at São Jorge, morning bakery run to Fabrica, my grandmother's caldo verde recipe."
                className="mt-1.5 border-2 border-foreground shadow-hard-sm rounded-xl min-h-[90px]" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl border-2 border-dashed border-foreground/40 bg-mustard/20">
              <p className="font-hand text-2xl text-accent mb-1">✨ Import reviews</p>
              <p className="text-sm text-muted-foreground mb-3">
                Paste your Google Maps or Airbnb listing URL. We'll pull in your verified guest reviews and style them as Polaroids.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[220px]">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={data.importUrl}
                    onChange={(e) => update("importUrl", e.target.value)}
                    placeholder="https://maps.google.com/…  or  https://airbnb.com/rooms/…"
                    className="pl-9 border-2 border-foreground shadow-hard-sm rounded-xl h-11 bg-white" />
                </div>
                <Button onClick={simulateImport} disabled={importing}
                  className="bg-accent text-accent-foreground border-2 border-foreground shadow-hard-sm rounded-xl h-11 px-4 hover:bg-accent/90">
                  {importing ? "Importing…" : (<><Sparkles className="w-4 h-4 mr-1" /> Import Reviews</>)}
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground">Or paste them yourself — you can always edit later.</p>
            {data.reviews.map((r, i) => (
              <div key={i} className={cn("polaroid relative", ["rotate-[-1.5deg]", "rotate-[1deg]", "rotate-[-1deg]"][i])}>
                <div className="tape" />
                <div className="flex gap-2">
                  <Input value={r.author}
                    onChange={(e) => {
                      const next = [...data.reviews]; next[i] = { ...next[i], author: e.target.value }; update("reviews", next);
                    }}
                    placeholder="Guest name (e.g. Mira, Berlin)"
                    className="border-2 border-foreground rounded-xl h-10 flex-1" />
                  <div className="inline-flex items-center gap-1 border-2 border-foreground rounded-xl h-10 px-2 bg-white">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button"
                        onClick={() => {
                          const next = [...data.reviews]; next[i] = { ...next[i], rating: s }; update("reviews", next);
                        }}>
                        <Star className={cn("w-4 h-4", s <= r.rating ? "fill-mustard text-foreground" : "text-muted-foreground/40")} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea value={r.text}
                  onChange={(e) => {
                    const next = [...data.reviews]; next[i] = { ...next[i], text: e.target.value }; update("reviews", next);
                  }}
                  placeholder="Loved every second — the breakfast, the light, the little cat that visits at 8am..."
                  className="mt-2 border-2 border-foreground rounded-xl min-h-[70px] font-hand text-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="border-2 border-foreground shadow-hard-sm rounded-xl h-12 px-5 disabled:opacity-40">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {step < total ? (
            <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}
              className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-12 px-6 hover:bg-primary/90">
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={onGenerate}
              className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-12 px-6 hover:bg-primary/90 text-base font-bold">
              <Sparkles className="w-5 h-5 mr-2" /> Generate My Boutique Website
            </Button>
          )}
        </div>
      </div>

      <p className="mt-6 font-hand text-xl text-accent">no code · no fuss · just your story ✿</p>
    </div>
  );
}

function RoomCard({
  room, onChange, onRemove,
}: {
  room: RoomType;
  onChange: (patch: Partial<RoomType>) => void;
  onRemove?: () => void;
}) {
  const [amenityDraft, setAmenityDraft] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result || "");
        
        // Compress image using canvas to avoid Vercel payload limits
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL("image/jpeg", 0.5);
            onChange({ photos: [...room.photos, compressedUrl].slice(0, 6) });
          } else {
            onChange({ photos: [...room.photos, url].slice(0, 6) });
          }
        };
        img.src = url;
      };
      reader.readAsDataURL(f);
    });
  };

  const addAmenity = (a: string) => {
    const v = a.trim();
    if (!v || room.amenities.includes(v)) return;
    onChange({ amenities: [...room.amenities, v] });
    setAmenityDraft("");
  };

  return (
    <div className="p-4 rounded-2xl border-2 border-foreground shadow-hard-sm bg-cream/60">
      <div className="flex flex-wrap gap-2 items-start">
        <Input value={room.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Master Suite · Terrace view"
          className="border-2 border-foreground rounded-xl h-11 flex-1 min-w-[180px] bg-white" />
        <div className="relative w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
          <Input type="number" value={room.price}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            className="border-2 border-foreground rounded-xl h-11 pl-7 bg-white" />
        </div>
        {onRemove && (
          <Button type="button" variant="outline" size="icon" onClick={onRemove}
            className="border-2 border-foreground rounded-xl h-11 w-11 shrink-0 bg-white">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Amenities */}
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Amenities</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {room.amenities.map((a) => (
            <span key={a} className="inline-flex items-center gap-1 bg-white border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold">
              {a}
              <button type="button" onClick={() => onChange({ amenities: room.amenities.filter((x) => x !== a) })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <Input value={amenityDraft}
            onChange={(e) => setAmenityDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(amenityDraft); } }}
            placeholder="Add amenity"
            className="border-2 border-foreground rounded-full h-8 w-36 text-xs px-3 bg-white" />
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {AMENITY_SUGGESTIONS.filter((s) => !room.amenities.includes(s)).slice(0, 6).map((s) => (
            <button key={s} type="button" onClick={() => addAmenity(s)}
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Photos dropzone */}
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Photos</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-colors bg-white",
            dragOver ? "border-primary bg-primary/5" : "border-foreground/40",
          )}
        >
          <Upload className="w-5 h-5 mx-auto text-muted-foreground" />
          <p className="text-sm mt-1"><span className="font-bold">Drop photos here</span> or click to browse</p>
          <p className="text-xs text-muted-foreground">up to 6 images per room</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </div>
        {room.photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {room.photos.map((p, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg border-2 border-foreground overflow-hidden shadow-hard-sm">
                <img src={p} alt="" className="w-full h-full object-cover" />
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); onChange({ photos: room.photos.filter((_, j) => j !== i) }); }}
                  className="absolute top-0.5 right-0.5 bg-cream border border-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {room.amenities.length === 0 && room.photos.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1">
          <Heart className="w-3 h-3 text-primary" /> Guests decide with their eyes — add a photo or two.
        </p>
      )}
    </div>
  );
}
