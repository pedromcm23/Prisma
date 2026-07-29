"use client";

import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, Check } from "lucide-react";
import type { PropertyData, TemplateId } from "@/lib/prisma-types";
import { cn } from "@/lib/utils";

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
};

const TEMPLATES: { id: TemplateId; name: string; description: string; emoji: string; preview: string; defaultColor: string }[] = [
  {
    id: "boutique",
    name: "Boutique",
    description: "Hand-crafted polaroid style with warm ink borders",
    emoji: "✿",
    preview: "Polaroid · Handwritten · Cosy",
    defaultColor: "#D96B43",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, whitespace-driven with bold typography",
    emoji: "◻",
    preview: "Clean · Modern · Elegant",
    defaultColor: "#1a1a1a",
  },
  {
    id: "tropical",
    name: "Tropical",
    description: "Vibrant gradient hero with wave dividers",
    emoji: "🌴",
    preview: "Vibrant · Lush · Energetic",
    defaultColor: "#0D9488",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Dark editorial with gold accents and fine lines",
    emoji: "◈",
    preview: "Dark · Editorial · Premium",
    defaultColor: "#C9A84C",
  },
  {
    id: "rustic",
    name: "Rustic",
    description: "Warm earth tones with a cosy cabin feel",
    emoji: "🪵",
    preview: "Earthy · Warm · Cabin",
    defaultColor: "#8B4513",
  },
];

const COLOUR_PRESETS = [
  "#D96B43", // terracotta
  "#C9A84C", // gold
  "#0D9488", // teal
  "#8B4513", // brown
  "#1D4E89", // ocean blue
  "#7C3AED", // violet
  "#DB2777", // pink
  "#059669", // emerald
  "#DC2626", // red
  "#1a1a1a", // ink black
];

export function TemplatePicker({ data, setData }: Props) {
  const logoRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof PropertyData>(k: K, v: PropertyData[K]) =>
    setData({ ...data, [k]: v });

  const handleLogoUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => set("brandLogo", String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const selectTemplate = (id: TemplateId) => {
    const template = TEMPLATES.find((t) => t.id === id);
    // Snap the default brand colour when switching templates (only if still using a default)
    const isDefaultColor = TEMPLATES.some((t) => t.defaultColor === data.brandColor);
    setData({
      ...data,
      templateId: id,
      brandColor: isDefaultColor && template ? template.defaultColor : data.brandColor,
    });
  };

  return (
    <div className="space-y-8">
      {/* Template grid */}
      <div>
        <Label className="text-base font-bold mb-3 block">Choose your template style</Label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => {
            const selected = data.templateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTemplate(t.id)}
                className={cn(
                  "relative text-left rounded-2xl border-2 p-4 transition-all hover:-translate-y-0.5",
                  selected
                    ? "border-foreground shadow-hard bg-cream"
                    : "border-foreground/30 hover:border-foreground/60 bg-white/60"
                )}
              >
                {selected && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary border-2 border-foreground flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                {/* Mini preview strip */}
                <div
                  className="w-full h-20 rounded-lg mb-3 flex items-center justify-center text-3xl border border-foreground/20"
                  style={{ backgroundColor: `${t.defaultColor}22` }}
                >
                  {t.emoji}
                </div>
                <p className="font-display font-bold text-base">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-2 opacity-60">{t.preview}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand colour */}
      <div>
        <Label className="text-base font-bold mb-3 block">Brand colour</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {COLOUR_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("brandColor", c)}
              className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: data.brandColor === c ? "#000" : "transparent",
                boxShadow: data.brandColor === c ? "0 0 0 2px white, 0 0 0 4px black" : "none",
              }}
              title={c}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={data.brandColor}
            onChange={(e) => set("brandColor", e.target.value)}
            className="w-10 h-10 rounded-lg border-2 border-foreground cursor-pointer p-0.5 bg-white"
            title="Custom colour"
          />
          <Input
            value={data.brandColor}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) set("brandColor", v);
            }}
            className="w-36 font-mono border-2 border-foreground shadow-hard-sm rounded-xl h-10"
            placeholder="#D96B43"
          />
          <span className="text-sm text-muted-foreground">Pick any colour for your brand</span>
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <Label className="text-base font-bold mb-3 block">Logo (optional)</Label>
        {data.brandLogo ? (
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-16 rounded-xl border-2 border-foreground shadow-hard-sm bg-white flex items-center justify-center overflow-hidden">
              <img src={data.brandLogo} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
            </div>
            <button
              type="button"
              onClick={() => set("brandLogo", "")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        ) : (
          <div
            onClick={() => logoRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-foreground/40 rounded-xl p-6 text-center hover:border-foreground transition-colors bg-white/50 max-w-xs"
          >
            <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-bold">Drop your logo here</p>
            <p className="text-xs text-muted-foreground">PNG, SVG, or JPG — shown in the header & footer</p>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { handleLogoUpload(e.target.files); e.target.value = ""; }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
