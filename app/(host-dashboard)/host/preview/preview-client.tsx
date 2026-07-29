"use client";

import { useState, useEffect } from "react";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import type { PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";
import { saveBoutiqueSite } from "@/app/actions/property";

export function PreviewClient({ initialData }: { initialData: PropertyData }) {
  const [data, setData] = useState<PropertyData>(initialData);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = sessionStorage.getItem("prisma_draft");
      if (draft) {
        try {
          setData(JSON.parse(draft));
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, []);

  const handlePublish = async (kit: any) => {
    setIsPublishing(true);
    try {
      await saveBoutiqueSite(data, kit, "demo-host-id");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("prisma_draft");
      }
      router.push(`/host/properties`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <BoutiqueSite 
      data={data} 
      setData={(newData) => {
        setData(newData);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("prisma_draft", JSON.stringify(newData));
        }
      }} 
      onBack={() => router.push("/host/builder")} 
      onPublish={handlePublish} 
      isPublishing={isPublishing} 
      readOnly={false}
    />
  );
}
