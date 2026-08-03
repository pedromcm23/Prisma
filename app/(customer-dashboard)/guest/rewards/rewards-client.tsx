"use client";

import { Gift, Share2, Sparkles, Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { redeemPoints, submitSocialMediaPost } from "@/app/actions/rewards";
import { useRouter } from "next/navigation";

export type Transaction = {
  id: string;
  points: number;
  type: string;
  status: string;
  note: string | null;
  date: string;
};

export function RewardsClient({ 
  balance, 
  transactions,
  referralCode
}: { 
  balance: number;
  transactions: Transaction[];
  referralCode: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const REDEEM_THRESHOLD = 1000;
  const COUPON_VALUE = 50;

  const canRedeem = balance >= REDEEM_THRESHOLD;
  const pct = Math.min(100, Math.round((balance / REDEEM_THRESHOLD) * 100));
  
  // Calculate total earned ever (ignoring spent/redeemed)
  const earned = transactions.filter(t => t.points > 0 && t.status === "APPROVED").reduce((sum, t) => sum + t.points, 0);

  const handleRedeem = async () => {
    try {
      setLoading(true);
      await redeemPoints();
      toast.success(`€${COUPON_VALUE} coupon unlocked — check your email!`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to redeem");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      setLoading(true);
      await submitSocialMediaPost(url);
      toast.success("Post submitted! Points will be awarded once verified.");
      setUrl("");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const copyReferral = () => {
    const link = `https://prisma-gray-two.vercel.app/invite/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Toaster />
      <div className="mb-8">
        <p className="font-hand text-2xl text-accent">your perks</p>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold leading-tight">My Rewards</h1>
      </div>

      <div className="space-y-6">
        {/* Ledger */}
        <div className="hand-border bg-primary text-primary-foreground p-6">
          <p className="text-xs font-bold uppercase tracking-wider opacity-90">Points balance</p>
          <p className="font-display text-6xl font-extrabold leading-none mt-1">{balance.toLocaleString()}</p>
          <p className="text-sm mt-2 opacity-90">{earned.toLocaleString()} points earned all time</p>

          <div className="mt-5 h-4 rounded-full border-2 border-foreground bg-cream overflow-hidden">
            <div className="h-full bg-mustard border-r-2 border-foreground transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-bold">
            <span>{pct}% to your next coupon</span>
            <span>{REDEEM_THRESHOLD.toLocaleString()} pts = €{COUPON_VALUE}</span>
          </div>

          <Button
            disabled={!canRedeem || loading}
            onClick={handleRedeem}
            className={cn(
              "mt-5 w-full sm:w-auto border-2 border-foreground shadow-hard rounded-xl h-12 px-6 font-bold",
              canRedeem ? "bg-mustard text-foreground hover:bg-mustard/90" : "bg-cream text-muted-foreground",
            )}
          >
            <Gift className="w-4 h-4 mr-1" /> Redeem €{COUPON_VALUE} Coupon
          </Button>
          {!canRedeem && (
            <p className="text-xs mt-2 opacity-90">
              {(REDEEM_THRESHOLD - balance).toLocaleString()} more points to redeem.
            </p>
          )}
        </div>

        {/* Ways to Earn */}
        <div>
          <h3 className="font-display text-2xl font-extrabold mb-3 mt-10">Ways to Earn</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RuleCard n="01" pts="500" title="Book a stay" body="Automatically awarded after you check out." icon={<Check className="w-4 h-4" />} />
            <RuleCard n="02" pts="100" title="Leave a review" body="Rate your stay to help future guests." icon={<Sparkles className="w-4 h-4" />} />
            <RuleCard n="03" pts="250" title="Social media" body="Post & tag your stay. Submit below!" icon={<Share2 className="w-4 h-4" />} />
            <RuleCard n="04" pts="750" title="Refer a Host" body="Share your link and earn big when they join." icon={<Gift className="w-4 h-4" />} />
          </div>
        </div>

        {/* Action Zone (Invite + Social) */}
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div className="hand-border bg-white p-6">
            <h3 className="font-display text-xl font-extrabold mb-2">Invite & Earn</h3>
            <p className="text-sm text-muted-foreground mb-4">Give your friends €25 off their first stay, and you get 500 points when they book. Refer a host, get 750!</p>
            <div className="flex gap-2">
              <input readOnly value={`prisma.com/invite/${referralCode}`} className="flex-1 h-10 border-2 border-foreground rounded px-3 text-sm font-bold bg-cream" />
              <Button onClick={copyReferral} className="h-10 border-2 border-foreground shadow-hard-sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="hand-border bg-white p-6">
            <h3 className="font-display text-xl font-extrabold mb-2">Submit Social Post</h3>
            <p className="text-sm text-muted-foreground mb-4">Posted about your recent stay? Paste the link to TikTok or Instagram to claim your 250 points.</p>
            <form onSubmit={handleSubmitSocial} className="flex gap-2">
              <input 
                type="url" 
                placeholder="https://instagram.com/..." 
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className="flex-1 h-10 border-2 border-foreground rounded px-3 text-sm font-bold bg-cream" 
              />
              <Button type="submit" disabled={loading} className="h-10 border-2 border-foreground shadow-hard-sm bg-accent text-white hover:bg-accent/90">
                Submit
              </Button>
            </form>
          </div>
        </div>

        {/* Ledger Activity */}
        <div className="mt-10">
          <h3 className="font-display text-2xl font-extrabold mb-3">Recent Activity</h3>
          <div className="hand-border bg-white divide-y-2 divide-foreground/10">
            {transactions.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">You have no points history yet.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold flex items-center gap-2">
                      {tx.type === "STAY" && "Stay Completed"}
                      {tx.type === "SOCIAL" && "Social Media Post"}
                      {tx.type === "REFERRAL" && "Referral Bonus"}
                      {tx.type === "REDEEM" && "Coupon Redeemed"}
                      {tx.status === "PENDING" && <span className="bg-mustard/30 text-[10px] px-2 py-0.5 rounded-full border border-mustard">PENDING</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(tx.date), "d MMM yyyy")} • {tx.note || "System action"}
                    </p>
                  </div>
                  <span className={cn(
                    "text-lg font-extrabold font-display",
                    tx.points > 0 ? "text-primary" : "text-foreground"
                  )}>
                    {tx.points > 0 ? "+" : ""}{tx.points} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ n, title, body, icon, pts }: { n: string; title: string; body: string; icon: React.ReactNode, pts: string }) {
  return (
    <div className="hand-border bg-white p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Rule {n}
      </div>
      <div className="flex items-center gap-2 text-primary font-bold mb-1">
        {icon} <span className="text-xl font-display">{pts} pts</span>
      </div>
      <p className="font-display text-lg font-bold leading-tight mt-1">{title}</p>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
