"use client";

import Link from "next/link";
import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import { emptyData, type PropertyData } from "@/lib/prisma-types";

export default function HostPage() {
  const [data, setData] = useState<PropertyData>(() => {
    const d = emptyData();
    d.name = "Casa Amarela";
    d.location = "Alfama, Lisbon";
    d.tagline = "A sunlit hideaway on the old cobbled hill";
    d.specials = [
      "Homemade sourdough breakfast on the terrace",
      "Sunlit terracotta terrace with lemon trees",
      "Secret beach path just 5 minutes away",
    ];
    d.hostName = "Ana";
    d.hostInterests = "Surfing, Natural Wine, Local Pottery";
    d.hostLoves = "Secret sunset spot at São Jorge, morning bakery run to Fabrica";
    d.reviews = [
      { text: "Woke up to bells and warm bread. Never wanted to leave.", author: "Mira, Berlin", rating: 5 },
      { text: "The tiles, the light, the little cat. A whole vibe.", author: "Julián, CDMX", rating: 5 },
      { text: "Ana knew every good spot. Felt like visiting a friend.", author: "Sara, Rome", rating: 5 },
    ];
    return d;
  });
  const [view, setView] = useState<"form" | "site">("form");

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <Link href="/" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
          ← Prisma home
        </Link>
      </div>
      {view === "form" ? (
        <OnboardingWizard
          data={data}
          setData={setData}
          onGenerate={() => {
            setView("site");
            if (typeof window !== "undefined") window.scrollTo({ top: 0 });
          }}
        />
      ) : (
        <BoutiqueSite data={data} setData={setData} onBack={() => setView("form")} />
      )}
    </div>
  );
}
