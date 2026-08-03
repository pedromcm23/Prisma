"use client";

import { useState, useEffect } from "react";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import type { PropertyData } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";
import { saveBoutiqueSite } from "@/app/actions/property";

import { globalDraftStore } from "@/lib/store";

import { Button } from "@/components/ui/button";

export function PreviewClient({ initialData, propertyId, initialBrandKit, hasNoProperty }: { initialData: PropertyData, propertyId?: string, initialBrandKit?: any, hasNoProperty?: boolean }) {
  const [data, setData] = useState<PropertyData>(initialData);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [isCheckingDraft, setIsCheckingDraft] = useState(true);
  const router = useRouter();
  
  const draftKey = `prisma_draft_${propertyId || 'new'}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      let draftFound = false;
      if (globalDraftStore[draftKey]) {
        setData(globalDraftStore[draftKey]);
        draftFound = true;
      } else {
        const draft = sessionStorage.getItem(draftKey);
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            setData({ ...initialData, ...parsed });
            draftFound = true;
          } catch (e) {
            console.error("Failed to parse draft", e);
          }
        }
      }
      setHasDraft(draftFound);
      setIsCheckingDraft(false);
    }
  }, [draftKey]);

  const handlePublish = async (kit: any) => {
    setIsPublishing(true);
    try {
      await saveBoutiqueSite(data, kit, propertyId);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(draftKey);
        delete globalDraftStore[draftKey];
      }
      // Intentionally not redirecting so they see the "You're live" modal
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (hasNoProperty && !isCheckingDraft && !hasDraft) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-3xl font-display font-extrabold mb-4">You haven't created a website yet</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Start by filling out your property details to generate a beautiful, ready-to-publish website.</p>
        <Button onClick={() => router.push("/host/builder")} className="bg-primary text-primary-foreground font-bold h-11 px-8 rounded-full shadow-hard border-2 border-foreground hover:bg-primary/90">
          Create Your Website
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto pb-12">
        <BoutiqueSite 
          data={data} 
          initialBrandKit={initialBrandKit || {}}
          setData={(newData) => {
            setData(newData);
            if (typeof window !== "undefined") {
              globalDraftStore[draftKey] = newData;
            }
          }} 
          onBack={() => router.push(`/host/builder${propertyId ? `?id=${propertyId}` : ''}`)} 
          onPublish={handlePublish} 
          isPublishing={isPublishing} 
          readOnly={false}
        />
      </div>
    </div>
  );
}
