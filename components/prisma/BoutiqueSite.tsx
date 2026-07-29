"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Wrench, Save, ArrowLeft, Copy, Check, Wand2,
} from "lucide-react";
import type { PropertyData } from "@/lib/prisma-types";
import { TemplateRenderer } from "./TemplateRenderer";

type Props = {
  data: PropertyData;
  setData: (d: PropertyData) => void;
  onBack: () => void;
  onOpenUnlayer?: () => void;
};

export function BoutiqueSite({ data, setData, onBack, onOpenUnlayer }: Props) {
  const [editing, setEditing] = useState(true);
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);

  const slug = (data.name || "your-stay").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/stay/${slug}`
    : `/stay/${slug}`;

  return (
    <div className="min-h-screen">
      {/* Sticky editor banner */}
      <div className="sticky top-0 z-40 bg-mustard border-b-2 border-foreground shadow-hard-sm">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span className="font-bold text-sm">🛠 Editor Mode {editing ? "Active" : "Paused"}</span>
            <span className="hidden sm:inline text-xs text-foreground/70">
              — click any text to edit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onBack}
              className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-cream"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to form
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing((e) => !e)}
              className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-cream"
            >
              {editing ? "Preview" : "Edit"}
            </Button>
            {onOpenUnlayer && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenUnlayer}
                className="border-2 border-foreground shadow-hard-sm rounded-lg h-9 bg-cream"
              >
                <Wand2 className="w-4 h-4 mr-1" /> Fine-tune with Editor
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setShowPublish(true)}
              className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-lg h-9 hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-1" /> Save & Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Template renderer — uses data.templateId to pick the correct template */}
      <TemplateRenderer data={data} setData={setData} editing={editing} />

      {/* Publish modal */}
      <Dialog open={showPublish} onOpenChange={setShowPublish}>
        <DialogContent className="border-2 border-foreground shadow-hard-lg rounded-2xl bg-cream">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">🎉 You're live!</DialogTitle>
            <DialogDescription>
              Your boutique website is published. Share this direct-booking link anywhere — Instagram bio, WhatsApp, replies to Airbnb inquiries.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="border-2 border-foreground shadow-hard-sm rounded-xl h-12 font-mono text-sm bg-white"
              />
              <Button
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm rounded-xl h-12 px-4 hover:bg-primary/90"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-foreground/40 bg-mustard/30">
              <p className="font-hand text-2xl">next little steps ✿</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Add your logo & real photos</li>
                <li>• Connect your payment provider</li>
                <li>• Point your custom domain here</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
