"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Camera, Image as ImageIcon, QrCode } from "lucide-react";
import type { BrandKit, FontPair } from "@/lib/brand-kit";
import { FONT_PAIRS } from "@/lib/brand-kit";
import type { PropertyData } from "@/lib/prisma-types";

type Props = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  kit: BrandKit;
  data: PropertyData;
  shareUrl: string;
};

function esc(s: string) {
  return (s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "amp;" }[c] as string));
}

function downloadSvg(name: string, svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function pair(k: BrandKit): FontPair {
  return FONT_PAIRS.find((f) => f.id === k.fontPairId) ?? FONT_PAIRS[0];
}

function wrapWords(text: string, maxChars: number): string[] {
  const words = (text || "").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line ? line + " " : "") + w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function logoBadge(k: BrandKit, cx: number, cy: number, r: number) {
  if (k.logoDataUrl) {
    return `
      <clipPath id="logoClip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="${k.cream}" stroke="${k.foreground}" stroke-width="4"/>
      <image href="${k.logoDataUrl}" x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" clip-path="url(#logoClip)" preserveAspectRatio="xMidYMid slice"/>
    `;
  }
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${k.primary}" stroke="${k.foreground}" stroke-width="4"/>
    <text x="${cx}" y="${cy + r * 0.25}" text-anchor="middle" font-family='Georgia, serif' font-weight="800" font-size="${r * 0.95}" fill="${k.cream}">✿</text>
  `;
}

function instagramStorySvg(k: BrandKit, data: PropertyData, shareUrl: string) {
  const p = pair(k);
  const specials = (data.specials || []).filter(Boolean).slice(0, 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${k.primary}" opacity="0.18"/>
    </pattern>
  </defs>
  <rect width="1080" height="1920" fill="${k.background}"/>
  <rect width="1080" height="1920" fill="url(#dots)"/>

  <!-- top bar -->
  <rect x="60" y="80" width="960" height="120" rx="60" fill="${k.mustard}" stroke="${k.foreground}" stroke-width="6"/>
  <text x="540" y="158" text-anchor="middle" font-family='${p.sans}' font-size="46" font-weight="800" fill="${k.foreground}" letter-spacing="4">✿ ${esc((data.location || "").toUpperCase())} ✿</text>

  ${logoBadge(k, 540, 360, 100)}

  <text x="540" y="560" text-anchor="middle" font-family='${p.display}' font-weight="800" font-size="120" fill="${k.foreground}">${esc(data.name)}</text>
  <text x="540" y="640" text-anchor="middle" font-family='${p.hand}' font-size="60" fill="${k.accent}">${esc(data.tagline)}</text>

  <!-- three specials -->
  ${specials.map((s, i) => {
    const y = 780 + i * 240;
    const lines = wrapWords(s, 32);
    return `
    <g>
      <rect x="80" y="${y}" width="920" height="200" rx="24" fill="${k.cream}" stroke="${k.foreground}" stroke-width="6"/>
      <circle cx="150" cy="${y + 100}" r="52" fill="${k.primary}" stroke="${k.foreground}" stroke-width="5"/>
      <text x="150" y="${y + 118}" text-anchor="middle" font-family='${p.display}' font-weight="800" font-size="52" fill="${k.cream}">${i + 1}</text>
      ${lines.map((ln, li) => `<text x="230" y="${y + 90 + li * 46}" font-family='${p.sans}' font-size="38" font-weight="600" fill="${k.foreground}">${esc(ln)}</text>`).join("")}
    </g>`;
  }).join("")}

  <!-- CTA -->
  <rect x="140" y="1560" width="800" height="180" rx="90" fill="${k.primary}" stroke="${k.foreground}" stroke-width="8"/>
  <text x="540" y="1650" text-anchor="middle" font-family='${p.sans}' font-size="56" font-weight="800" fill="${k.cream}">Book Direct — No Fees</text>
  <text x="540" y="1710" text-anchor="middle" font-family='${p.sans}' font-size="34" fill="${k.cream}" opacity="0.9">${esc(shareUrl)}</text>

  <text x="540" y="1830" text-anchor="middle" font-family='${p.hand}' font-size="48" fill="${k.foreground}">made with ♡ on Prisma</text>
</svg>`;
}

function polaroidReviewSvg(k: BrandKit, data: PropertyData) {
  const p = pair(k);
  const review = (data.reviews || []).find((r) => (r.text || "").trim()) ?? (data.reviews || [])[0];
  const lines = wrapWords(review?.text || "Loved every second.", 26);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="${k.background}"/>
  <!-- polaroid frame rotated -->
  <g transform="translate(540 540) rotate(-3) translate(-380 -430)">
    <rect x="0" y="0" width="760" height="860" fill="#ffffff" stroke="${k.foreground}" stroke-width="6" rx="6"/>
    <!-- tape -->
    <rect x="310" y="-20" width="180" height="46" fill="${k.mustard}" stroke="${k.foreground}" stroke-width="2" transform="rotate(-3 400 3)"/>
    <!-- picture area -->
    <rect x="40" y="40" width="680" height="560" fill="${k.primary}" stroke="${k.foreground}" stroke-width="4"/>
    <text x="380" y="340" text-anchor="middle" font-family='${p.display}' font-size="70" font-weight="800" fill="${k.cream}">${esc(data.name)}</text>
    <text x="380" y="400" text-anchor="middle" font-family='${p.hand}' font-size="46" fill="${k.cream}">${esc(data.location)}</text>
    <!-- caption -->
    ${lines.slice(0, 3).map((ln, i) => `<text x="380" y="${660 + i * 46}" text-anchor="middle" font-family='${p.hand}' font-size="42" fill="${k.foreground}">${esc(ln)}</text>`).join("")}
    <text x="380" y="820" text-anchor="middle" font-family='${p.sans}' font-size="26" font-weight="700" fill="${k.foreground}">— ${esc(review?.author || "A happy guest")} · ★★★★★</text>
  </g>
  <text x="540" y="1040" text-anchor="middle" font-family='${p.hand}' font-size="38" fill="${k.foreground}">notes on the fridge · book direct on Prisma</text>
</svg>`;
}

function qrFlyerSvg(k: BrandKit, data: PropertyData, shareUrl: string) {
  const p = pair(k);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=0&color=${encodeURIComponent(k.foreground.replace("#", ""))}&bgcolor=${encodeURIComponent(k.cream.replace("#", ""))}&data=${encodeURIComponent(shareUrl)}`;
  // A5 at 300dpi ≈ 1748 x 2480
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1748" height="2480" viewBox="0 0 1748 2480">
  <rect width="1748" height="2480" fill="${k.background}"/>
  <rect x="60" y="60" width="1628" height="2360" fill="${k.cream}" stroke="${k.foreground}" stroke-width="10" rx="40"/>

  ${logoBadge(k, 874, 260, 110)}

  <text x="874" y="490" text-anchor="middle" font-family='${p.display}' font-weight="800" font-size="120" fill="${k.foreground}">${esc(data.name)}</text>
  <text x="874" y="570" text-anchor="middle" font-family='${p.hand}' font-size="66" fill="${k.accent}">${esc(data.tagline)}</text>

  <!-- QR block -->
  <rect x="574" y="700" width="600" height="600" fill="${k.cream}" stroke="${k.foreground}" stroke-width="6"/>
  <image href="${qrSrc}" x="574" y="700" width="600" height="600"/>

  <!-- Ribbon -->
  <rect x="200" y="1400" width="1348" height="160" rx="80" fill="${k.mustard}" stroke="${k.foreground}" stroke-width="8"/>
  <text x="874" y="1502" text-anchor="middle" font-family='${p.sans}' font-size="66" font-weight="800" fill="${k.foreground}">Loved it here? Book direct next time.</text>

  <text x="874" y="1690" text-anchor="middle" font-family='${p.sans}' font-size="44" font-weight="700" fill="${k.foreground}">Scan the little square above ↑</text>
  <text x="874" y="1760" text-anchor="middle" font-family='${p.sans}' font-size="38" fill="${k.foreground}" opacity="0.75">or visit ${esc(shareUrl)}</text>

  <!-- Perks -->
  <g font-family='${p.sans}' font-size="42" fill="${k.foreground}">
    <text x="874" y="1900" text-anchor="middle" font-weight="800" fill="${k.primary}">✿ Direct booking perks ✿</text>
    <text x="874" y="1975" text-anchor="middle">— No booking fees, ever</text>
    <text x="874" y="2035" text-anchor="middle">— Free cancellation up to 7 days</text>
    <text x="874" y="2095" text-anchor="middle">— Little host welcome on arrival</text>
  </g>

  <text x="874" y="2340" text-anchor="middle" font-family='${p.hand}' font-size="52" fill="${k.foreground}">made with ♡ on Prisma</text>
</svg>`;
}

export function BrandExportModal({ open, onOpenChange, kit, data, shareUrl }: Props) {
  const items = [
    {
      key: "story",
      label: "Instagram Story",
      dim: "1080 × 1920",
      Icon: Camera,
      make: () => instagramStorySvg(kit, data, shareUrl),
      file: `${data.name || "prisma"}-story.svg`,
    },
    {
      key: "polaroid",
      label: "Polaroid Review Post",
      dim: "1080 × 1080",
      Icon: ImageIcon,
      make: () => polaroidReviewSvg(kit, data),
      file: `${data.name || "prisma"}-polaroid.svg`,
    },
    {
      key: "qr",
      label: "Room QR Flyer (A5)",
      dim: "1748 × 2480",
      Icon: QrCode,
      make: () => qrFlyerSvg(kit, data, shareUrl),
      file: `${data.name || "prisma"}-qr-flyer.svg`,
    },
  ];

  const previews = {
    story: instagramStorySvg(kit, data, shareUrl),
    polaroid: polaroidReviewSvg(kit, data),
    qr: qrFlyerSvg(kit, data, shareUrl),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-foreground shadow-hard-lg rounded-2xl bg-cream max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">📦 Brand & Social Kit</DialogTitle>
          <DialogDescription>
            One-click downloads, all in your current colors, fonts and logo. Post them anywhere.
          </DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-3 gap-4 mt-2">
          {items.map((it) => {
            const svg = previews[it.key as keyof typeof previews];
            const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
            return (
              <div key={it.key} className="bg-white hand-border p-3 flex flex-col">
                <div className="aspect-[3/4] rounded-md border-2 border-foreground overflow-hidden bg-cream flex items-center justify-center">
                  <img src={dataUrl} alt={it.label} className="w-full h-full object-contain" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <it.Icon className="w-4 h-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{it.label}</p>
                    <p className="text-[10px] text-muted-foreground">{it.dim}</p>
                  </div>
                </div>
                <Button
                  onClick={() => downloadSvg(it.file, it.make())}
                  className="mt-2 bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-lg h-9 text-sm"
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Files are SVG — open in Canva, Figma, Photoshop, or drop straight into Instagram.
        </p>
      </DialogContent>
    </Dialog>
  );
}
