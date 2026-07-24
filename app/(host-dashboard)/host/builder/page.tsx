"use client";

import Link from "next/link";
import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { UnlayerEditor } from "@/components/prisma/UnlayerEditor";
import { emptyData, type PropertyData } from "@/lib/prisma-types";
import { createProperty } from "@/app/actions/property";

export default function HostPage() {
  const [data, setData] = useState<PropertyData>(() => emptyData());
  const [view, setView] = useState<"form" | "site">("form");
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const handleWizardComplete = async () => {
    // Save to DB first
    try {
      const pid = await createProperty(data.name, data.tagline);
      setPropertyId(pid);
      setView("site");
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    } catch (e) {
      console.error(e);
      alert("Error creating property");
    }
  };

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
          onGenerate={handleWizardComplete}
        />
      ) : propertyId ? (
        <UnlayerEditor propertyId={propertyId} onBack={() => setView("form")} />
      ) : null}
    </div>
  );
}
