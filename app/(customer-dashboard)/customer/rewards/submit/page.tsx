"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitReward } from "@/app/actions/reward";
import Link from "next/link";
import { Sparkles, Trophy } from "lucide-react";

export default function RewardsSubmitPage() {
  const [postLink, setPostLink] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitReward(postLink, parseInt(followerCount) || 0);
      setStatus("success");
      setPostLink("");
      setFollowerCount("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between border-b-2 border-foreground">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-2xl font-display font-extrabold">Prisma</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-bold">
          <Link href="/search" className="hover:text-primary">Back to search</Link>
        </nav>
      </header>

      <main className="max-w-xl mx-auto mt-16 px-4">
        <div className="polaroid text-center">
          <div className="tape" />
          <Trophy className="w-12 h-12 text-mustard mx-auto mb-4" />
          <h1 className="font-display text-4xl font-extrabold mb-2">Claim Your Reward</h1>
          <p className="font-hand text-2xl text-accent mb-8">share your stay, earn points ✿</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-sm font-bold mb-1">Link to your social post</label>
              <Input
                type="url"
                required
                value={postLink}
                onChange={(e) => setPostLink(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="bg-white border-2 border-foreground shadow-hard-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Your Follower Count</label>
              <Input
                type="number"
                required
                min="0"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                placeholder="e.g. 1500"
                className="bg-white border-2 border-foreground shadow-hard-sm"
              />
            </div>
            
            <Button
              type="submit"
              disabled={status === "loading"}
              className="mt-4 bg-primary text-primary-foreground border-2 border-foreground shadow-hard font-bold hover:bg-primary/90 h-12"
            >
              {status === "loading" ? "Submitting..." : "Submit for review"}
            </Button>
            
            {status === "success" && (
              <p className="text-green-600 font-bold text-center mt-2">Reward submitted successfully! We will review it shortly.</p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-bold text-center mt-2">Failed to submit reward. Please try again.</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
