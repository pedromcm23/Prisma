"use client";

import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { type PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";
import { globalDraftStore } from "@/lib/store";

export function BuilderClient({ initialData, propertyId }: { initialData: PropertyData, propertyId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<PropertyData>(initialData);

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto pb-12">
        <OnboardingWizard
          data={data}
          setData={setData}
          onGenerate={() => {
            if (typeof window !== "undefined") {
              const key = `prisma_draft_${propertyId || 'new'}`;
              globalDraftStore[key] = data;
              sessionStorage.setItem(key, JSON.stringify(data));
            }
            router.push(`/host/preview${propertyId ? `?id=${propertyId}` : ''}`);
          }}
        />
      </div>
    </div>
  );
}
