"use client";

import { useState } from "react";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import type { PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";

export function PreviewClient({ initialData }: { initialData: PropertyData }) {
  const [data, setData] = useState<PropertyData>(initialData);
  const router = useRouter();

  return (
    <BoutiqueSite 
      data={data} 
      setData={setData} 
      onBack={() => router.push("/host/builder")} 
      onPublish={() => {}} 
      isPublishing={false} 
      readOnly={true}
    />
  );
}
