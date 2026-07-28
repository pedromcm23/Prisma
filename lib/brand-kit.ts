export type ThemeId = "folk-pop" | "coastal" | "sun-drenched";

export type BrandKit = {
  themeId: ThemeId;
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  mustard: string;
  cream: string;
  fontPairId: string;
  logoDataUrl: string | null;
};

export type FontPair = {
  id: string;
  label: string;
  display: string;
  sans: string;
  hand: string;
};

export const FONT_PAIRS: FontPair[] = [
  {
    id: "warm-serif",
    label: "Warm Serif + Modern Sans",
    display: '"Fraunces", Georgia, serif',
    sans: '"Nunito", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat", cursive',
  },
  {
    id: "playful-folk",
    label: "Playful Folk + Clean Body",
    display: '"Abril Fatface", Georgia, serif',
    sans: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat", cursive',
  },
  {
    id: "editorial",
    label: "Editorial Serif + Grotesk",
    display: '"Playfair Display", Georgia, serif',
    sans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat", cursive',
  },
  {
    id: "coastal-clean",
    label: "Coastal Clean Sans",
    display: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    sans: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    hand: '"Caveat", cursive',
  },
];

export type ThemePreset = {
  id: ThemeId;
  label: string;
  emoji: string;
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  mustard: string;
  cream: string;
  fontPairId: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "folk-pop",
    label: "Mediterranean Folk-Pop",
    emoji: "🌻",
    primary: "#D96B43",
    accent: "#1D4E89",
    background: "#F7F3EB",
    foreground: "#2A211A",
    mustard: "#F2C83B",
    cream: "#F7F3EB",
    fontPairId: "warm-serif",
  },
  {
    id: "coastal",
    label: "Minimalist Coastal",
    emoji: "🌊",
    primary: "#3E7CB1",
    accent: "#0F2E4C",
    background: "#F5F8FA",
    foreground: "#0F2E4C",
    mustard: "#EAD9B0",
    cream: "#FFFFFF",
    fontPairId: "coastal-clean",
  },
  {
    id: "sun-drenched",
    label: "Retro Sun-Drenched",
    emoji: "🌞",
    primary: "#E8622C",
    accent: "#8C3A1F",
    background: "#FBE9C8",
    foreground: "#3B1F10",
    mustard: "#F3B23A",
    cream: "#FFF3D9",
    fontPairId: "playful-folk",
  },
];

export function themeToBrandKit(id: ThemeId, existingLogo: string | null = null): BrandKit {
  const p = THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
  return {
    themeId: p.id,
    primary: p.primary,
    accent: p.accent,
    background: p.background,
    foreground: p.foreground,
    mustard: p.mustard,
    cream: p.cream,
    fontPairId: p.fontPairId,
    logoDataUrl: existingLogo,
  };
}

export function brandKitCssVars(k: BrandKit): React.CSSProperties {
  const pair = FONT_PAIRS.find((f) => f.id === k.fontPairId) ?? FONT_PAIRS[0];
  return {
    // shadcn semantic tokens
    ["--primary" as string]: k.primary,
    ["--accent" as string]: k.accent,
    ["--background" as string]: k.background,
    ["--foreground" as string]: k.foreground,
    ["--card" as string]: k.cream,
    ["--popover" as string]: k.cream,
    ["--border" as string]: k.foreground,
    ["--ring" as string]: k.primary,
    ["--muted-foreground" as string]: k.foreground + "AA",
    // custom prisma tokens used in classes like bg-mustard/text-cream
    ["--mustard" as string]: k.mustard,
    ["--cream" as string]: k.cream,
    ["--ink" as string]: k.foreground,
    ["--terracotta" as string]: k.primary,
    ["--ocean" as string]: k.accent,
    // fonts
    ["--font-display" as string]: pair.display,
    ["--font-sans" as string]: pair.sans,
    ["--font-hand" as string]: pair.hand,
    fontFamily: pair.sans,
    color: k.foreground,
    backgroundColor: k.background,
  };
}
