"use client";

import Link from "next/link";
import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import { UnlayerEditor } from "@/components/prisma/UnlayerEditor";
import { emptyData, type PropertyData } from "@/lib/prisma-types";

export default function BuilderPage() {
  const [data, setData] = useState<PropertyData>(() => {
    const d = emptyData();
    d.name = "";
    d.location = "";
    d.tagline = "";
    d.specials = ["", "", ""];
    d.hostName = "";
    d.hostInterests = "";
    d.hostLoves = "";
    d.reviews = [
      { text: "", author: "", rating: 5 },
      { text: "", author: "", rating: 5 },
      { text: "", author: "", rating: 5 },
    ];
    d.rooms = [
      { name: "", price: 120, amenities: [], photos: [] }
    ];
    return d;
  });

  const [view, setView] = useState<"form" | "site" | "unlayer">("form");
  // Stores the Unlayer design JSON once a user has previously saved via Unlayer
  const [savedDesign, setSavedDesign] = useState<Record<string, any> | null>(null);

  // A stable dummy propertyId for the builder page (replace with real DB id when persisting)
  const propertyId = "preview";

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-5 absolute top-0 left-0 z-50">
        <Link href="/" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary bg-white/50 px-2 py-1 rounded-md backdrop-blur">
          ← Prisma home
        </Link>
      </div>

      {view === "form" && (
        <OnboardingWizard
          data={data}
          setData={setData}
          onGenerate={() => {
            setView("site");
            if (typeof window !== "undefined") window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "site" && (
        <BoutiqueSite
          data={data}
          setData={setData}
          onBack={() => setView("form")}
          onOpenUnlayer={() => {
            setView("unlayer");
            if (typeof window !== "undefined") window.scrollTo({ top: 0 });
          }}
        />
      )}

      {view === "unlayer" && (
        <UnlayerEditor
          propertyId={propertyId}
          onBack={() => setView("site")}
          initialDesign={savedDesign}
        />
      )}
    </div>
  );
}
