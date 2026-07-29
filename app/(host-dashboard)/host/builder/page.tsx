"use client";

import Link from "next/link";
import { useState } from "react";
import { OnboardingWizard } from "@/components/prisma/OnboardingWizard";
import { emptyData, type PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";

export default function BuilderPage() {
  const router = useRouter();
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

  return (
    <div>
      <OnboardingWizard
        data={data}
        setData={setData}
        onGenerate={() => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("prisma_draft", JSON.stringify(data));
          }
          router.push("/host/preview");
        }}
      />
    </div>
  );
}
