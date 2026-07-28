import { useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Palette } from "lucide-react";
import { FONT_PAIRS, THEME_PRESETS, type BrandKit } from "@/lib/brand-kit";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  kit: BrandKit;
  setKit: (k: BrandKit) => void;
};

export function BrandKitDrawer({ open, onOpenChange, kit, setKit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onLogo = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setKit({ ...kit, logoDataUrl: String(reader.result) });
    reader.readAsDataURL(f);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-cream border-l-2 border-foreground overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" /> Brand Kit
          </SheetTitle>
          <SheetDescription>Tweak your logo, colors and fonts. Changes appear live.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* LOGO */}
          <section>
            <p className="font-hand text-2xl text-primary">your monogram ✿</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-foreground bg-white overflow-hidden flex items-center justify-center shadow-hard-sm shrink-0">
                {kit.logoDataUrl ? (
                  <img src={kit.logoDataUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-extrabold text-2xl text-foreground/40">P</span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onLogo(e.target.files?.[0])}
                />
                <Button
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-lg h-9"
                >
                  <Upload className="w-4 h-4 mr-1" /> Upload logo
                </Button>
                {kit.logoDataUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setKit({ ...kit, logoDataUrl: null })}
                    className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-white"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* COLORS */}
          <section>
            <p className="font-hand text-2xl text-primary">colors</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ColorField label="Primary" value={kit.primary} onChange={(v) => setKit({ ...kit, primary: v })} />
              <ColorField label="Accent" value={kit.accent} onChange={(v) => setKit({ ...kit, accent: v })} />
              <ColorField label="Background" value={kit.background} onChange={(v) => setKit({ ...kit, background: v })} />
              <ColorField label="Ink" value={kit.foreground} onChange={(v) => setKit({ ...kit, foreground: v })} />
              <ColorField label="Mustard" value={kit.mustard} onChange={(v) => setKit({ ...kit, mustard: v })} />
              <ColorField label="Cream" value={kit.cream} onChange={(v) => setKit({ ...kit, cream: v })} />
            </div>
          </section>

          {/* FONT PAIRS */}
          <section>
            <p className="font-hand text-2xl text-primary">font pairing</p>
            <div className="mt-3 grid gap-2">
              {FONT_PAIRS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setKit({ ...kit, fontPairId: f.id })}
                  className={cn(
                    "text-left rounded-xl border-2 border-foreground shadow-hard-sm bg-white px-4 py-3 transition-transform",
                    kit.fontPairId === f.id && "bg-mustard/40 -translate-y-0.5",
                  )}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{f.label}</p>
                  <p style={{ fontFamily: f.display }} className="text-2xl font-bold mt-1">Casa Amarela</p>
                  <p style={{ fontFamily: f.sans }} className="text-sm text-muted-foreground">
                    A sunlit hideaway on the cobbled hill.
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* PRESETS SHORTCUT */}
          <section>
            <p className="font-hand text-2xl text-primary">reset to a preset</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setKit({
                      ...kit,
                      themeId: p.id,
                      primary: p.primary,
                      accent: p.accent,
                      background: p.background,
                      foreground: p.foreground,
                      mustard: p.mustard,
                      cream: p.cream,
                      fontPairId: p.fontPairId,
                    })
                  }
                  className="rounded-full border-2 border-foreground shadow-hard-sm bg-white px-3 py-1 text-xs font-bold hover:bg-mustard/30"
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border-2 border-foreground shadow-hard-sm bg-white p-2">
      <input
        type="color"
        value={hexOnly(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-md border-2 border-foreground cursor-pointer bg-transparent"
        aria-label={label}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 px-1 text-xs font-mono border-0 shadow-none focus-visible:ring-0 bg-transparent"
        />
      </div>
    </label>
  );
}

function hexOnly(v: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  return "#000000";
}
