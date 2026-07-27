"use client";

import Link from "next/link";
import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
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
  const [view, setView] = useState<"form" | "site">("form");

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-5 absolute top-0 left-0 z-50">
        <Link href="/" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary bg-white/50 px-2 py-1 rounded-md backdrop-blur">
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
