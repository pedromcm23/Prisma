"use client";

import { useState, useEffect } from "react";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import type { PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";
import { saveBoutiqueSite } from "@/app/actions/property";

export function PreviewClient({ initialData, propertyId }: { initialData: PropertyData, propertyId?: string }) {
  const [data, setData] = useState<PropertyData>(initialData);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  
  const draftKey = `prisma_draft_${propertyId || 'new'}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = sessionStorage.getItem(draftKey);
      if (draft) {
        try {
          setData(JSON.parse(draft));
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [draftKey]);

  const handlePublish = async (kit: any) => {
    setIsPublishing(true);
    try {
      await saveBoutiqueSite(data, kit, "demo-host-id");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(draftKey);
      }
      // Intentionally not redirecting so they see the "You're live" modal
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
          sessionStorage.setItem(draftKey, JSON.stringify(newData));
        }
      }} 
      onBack={() => router.push(`/host/builder${propertyId ? `?id=${propertyId}` : ''}`)} 
      onPublish={handlePublish} 
      isPublishing={isPublishing} 
      readOnly={false}
    />
  );
}
