"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Instagram, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { submitGuestPerk } from "@/app/actions/perks";
import type { Listing } from "@/lib/prisma-types";

export function SharePerkForm({ properties }: { properties: Listing[] }) {
  const [propertyId, setPropertyId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [note, setNote] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!propertyId) {
      toast.error("Please select the stay you visited ✿");
      return;
    }
    if (!guestName.trim() || !guestEmail.trim() || (!postUrl.trim() && !fileName)) {
      toast.error("Add your name, email, and a post link or screenshot ✿");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("guestName", guestName);
      formData.append("guestEmail", guestEmail);
      formData.append("postUrl", postUrl.trim() || `[screenshot: ${fileName}]`);
      formData.append("note", note);

      await submitGuestPerk(formData);
      
      setSubmitted(true);
      toast.success("Sent to your host — they'll drop a code in your inbox soon 💌");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit perk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="hand-border bg-mustard/40 p-6 sm:p-10 grid md:grid-cols-[1.1fr_1fr] gap-8 items-start">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-cream px-3 py-1 shadow-hard-sm">
            <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Share the love</span>
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-extrabold leading-[0.95]">
            Get €15 off<br />your next stay
          </h2>
          <p className="mt-4 text-base leading-snug max-w-md">
            Tag your host on Instagram, TikTok, or anywhere you post — or send them a snapshot of the memory.
            They'll pop a little discount code back to you as a thank-you.
          </p>
          <ul className="mt-5 space-y-1.5 text-sm font-medium">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Snap a photo of your stay</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Tag your host and add #PrismaStays</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Drop the link below to claim your €15</li>
          </ul>
        </div>

        {submitted ? (
          <div className="bg-cream hand-border p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              <Check className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold">Thank you, friend ✿</p>
            <p className="mt-1 font-hand text-xl text-accent">your host is on it</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Keep an eye on your inbox — your €15 perk code will land there once approved.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setGuestName(""); setGuestEmail(""); setPostUrl(""); setNote(""); setFileName("");
              }}
              variant="outline"
              className="mt-4 border-2 border-foreground shadow-hard-sm rounded-xl bg-white"
            >
              Share another
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-cream hand-border p-6 space-y-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider">Which stay?</span>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="mt-1 border-2 border-foreground rounded-xl bg-white w-full h-11 px-3 outline-none"
              >
                <option value="" disabled>Select the boutique stay you visited...</option>
                {properties.map(p => (
                  <option key={p.slug} value={p.slug}>{p.name} (by {p.hostName})</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider">Your name</span>
                <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Mira" className="mt-1 border-2 border-foreground rounded-xl bg-white" />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="mira@mail.com" className="mt-1 border-2 border-foreground rounded-xl bg-white" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Instagram className="w-3 h-3" /> Link to your post
              </span>
              <Input
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://instagram.com/p/…"
                className="mt-1 border-2 border-foreground rounded-xl bg-white"
              />
            </label>
            <div className="text-center text-xs font-hand text-muted-foreground">— or —</div>
            <label className="flex items-center gap-3 border-2 border-dashed border-foreground/40 rounded-xl p-3 bg-white cursor-pointer hover:bg-mustard/20">
              <div className="w-10 h-10 rounded-lg bg-mustard border-2 border-foreground flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{fileName || "Upload a screenshot"}</p>
                <p className="text-xs text-muted-foreground">PNG or JPG · a little peek of your post</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider">A little note (optional)</span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Say hi to your host ✿"
                className="mt-1 border-2 border-foreground rounded-xl bg-white min-h-[70px]"
              />
            </label>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-12 font-bold hover:bg-primary/90">
              {loading ? "Sending..." : (<>Send to my host <Heart className="w-4 h-4 ml-1 fill-current" /></>)}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
