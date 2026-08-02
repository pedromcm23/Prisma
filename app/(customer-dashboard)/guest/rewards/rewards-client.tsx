"use client";

import { Gift, Share2, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  useRewards, pointsFor, REDEEM_THRESHOLD, COUPON_VALUE,
  POINTS_PER_STAY, POINTS_SHARED_BONUS,
  type GuestBooking
} from "@/lib/rewards-store";

export function RewardsClient({ initialBookings }: { initialBookings: GuestBooking[] }) {
  const { bookings, balance, earned, redeem, markShared } = useRewards(initialBookings);
  const canRedeem = balance >= REDEEM_THRESHOLD;
  const pct = Math.min(100, Math.round((balance / REDEEM_THRESHOLD) * 100));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Toaster />
      <div className="mb-8">
        <p className="font-hand text-2xl text-accent">your perks</p>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold leading-tight">My Rewards</h1>
      </div>

      <div className="space-y-6">
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
            disabled={!canRedeem}
            onClick={() => { redeem(); toast.success(`€${COUPON_VALUE} coupon unlocked — check your email!`); }}
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

        <div className="grid sm:grid-cols-3 gap-4">
          <RuleCard n="01" title={`Earn ${POINTS_PER_STAY} points`} body="For every completed stay booked through Prisma." icon={<Sparkles className="w-4 h-4" />} />
          <RuleCard n="02" title={`Double it — ${POINTS_PER_STAY + POINTS_SHARED_BONUS} points`} body="Share your stay on social media and earn double points." icon={<Share2 className="w-4 h-4" />} />
          <RuleCard n="03" title={`${REDEEM_THRESHOLD.toLocaleString()} pts = €${COUPON_VALUE}`} body={`Convert points into a €${COUPON_VALUE} discount coupon for your next stay.`} icon={<Gift className="w-4 h-4" />} />
        </div>

        <div className="mt-8">
          <h3 className="font-display text-2xl font-extrabold mb-3">Points by stay</h3>
          <div className="hand-border bg-white divide-y-2 divide-foreground/10">
            {bookings.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">You have no bookings yet. Start exploring stays to earn points!</p>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="p-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-bold">{b.stay}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(b.from), "d MMM yyyy")}</p>
                  </div>
                  {b.pointsAwarded ? (
                    <span className="text-sm font-bold text-primary">+{pointsFor(b)} pts</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Pending stay</span>
                  )}
                  {b.shared ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-foreground bg-mustard px-2 py-0.5">
                      <Check className="w-3 h-3" /> Shared ×2
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => { markShared(b.id); toast.success("Post verified — double points applied!"); }}
                      className="bg-white text-foreground border-2 border-foreground shadow-hard-sm rounded-lg h-8 text-xs font-bold hover:bg-mustard/30"
                    >
                      <Share2 className="w-3 h-3 mr-1" /> Share for ×2
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ n, title, body, icon }: { n: string; title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="hand-border bg-white p-4 h-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
        {icon} Rule {n}
      </div>
      <p className="font-display text-xl font-extrabold mt-1 leading-tight">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
