"use client";

import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { type PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";

export function BuilderClient({ initialData, propertyId }: { initialData: PropertyData, propertyId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<PropertyData>(initialData);

  return (
    <div>
      <OnboardingWizard
        data={data}
        setData={setData}
        onGenerate={() => {
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem(`prisma_draft_${propertyId || 'new'}`, JSON.stringify(data));
            } catch (e) {
              console.error("Storage error", e);
              toast.error("Photos are too large to save. Try removing some.");
              return;
            }
          }
          router.push(`/host/preview${propertyId ? `?id=${propertyId}` : ''}`);
        }}
      />
    </div>
  );
}
