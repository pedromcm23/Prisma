import { getHostPerks, approvePerk, seedDemoPerks } from "@/app/actions/perks";
import { Button } from "@/components/ui/button";
import { Check, Heart, Mail, ExternalLink, Inbox, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function GuestPerksPage() {
  const perks = await getHostPerks();
  
  const pending = perks.filter(p => p.status === "pending");
  const approved = perks.filter(p => p.status === "approved");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="font-hand text-3xl text-accent">share the love</p>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold">Guest perks</h2>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Guests who shared your stay on social. Send them €15 off as a little thank-you —
            it goes straight to their inbox.
          </p>
        </div>
        <div className="flex gap-3">
          <StatChip label="Waiting" value={pending.length} tone="mustard" />
          <StatChip label="Sent" value={approved.length} tone="primary" />
        </div>
      </div>

      {perks.length === 0 && (
        <div className="mt-8 hand-border bg-cream p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-mustard border-2 border-foreground shadow-hard-sm flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="mt-3 font-display text-2xl font-extrabold">No shares yet</p>
          <p className="mt-1 font-hand text-xl text-accent">but the postbox is open</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            When a guest tags you or drops a snapshot of their post, it'll appear here for a
            one-click €15 thank-you.
          </p>
          <form action={seedDemoPerks} className="mt-6">
            <Button variant="outline" type="submit" className="border-2 border-foreground rounded-xl bg-white shadow-hard-sm">
              <Gift className="w-4 h-4 mr-2" /> Seed Demo Perks
            </Button>
          </form>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-2xl font-extrabold mb-4">Waiting for your ✿</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {pending.map((p) => <PerkCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-2xl font-extrabold mb-4">Already thanked</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {approved.map((p) => <PerkCard key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: "mustard" | "primary" }) {
  return (
    <div className={cn(
      "hand-border px-4 py-2 flex items-center gap-3",
      tone === "mustard" ? "bg-mustard" : "bg-primary text-primary-foreground",
    )}>
      <span className="font-display text-3xl font-extrabold leading-none">{value}</span>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function PerkCard({ p }: { p: any }) {
  const isApproved = p.status === "approved";
  
  // We use bind to pass the ID to the server action
  const approveAction = approvePerk.bind(null, p.id);

  return (
    <div className={cn(
      "hand-border p-5",
      isApproved ? "bg-cream/70" : "bg-cream",
    )}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mustard border-2 border-foreground flex items-center justify-center font-display font-extrabold">
            {p.guestName.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-display text-lg font-extrabold leading-tight">{p.guestName}</p>
            <p className="text-xs text-muted-foreground">{p.guestEmail}</p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider bg-white border-2 border-foreground rounded-full px-2 py-0.5">
          {p.stayName}
        </span>
      </div>

      {p.note && (
        <p className="mt-3 font-hand text-xl text-accent leading-snug">"{p.note}"</p>
      )}

      <div className="mt-3">
        {p.postUrl.startsWith("http") ? (
          <a href={p.postUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary inline-flex items-center gap-1 break-all hover:underline">
            <ExternalLink className="w-3.5 h-3.5" /> {p.postUrl}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground italic">{p.postUrl}</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground">
          {new Date(p.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </p>
        {isApproved && p.code ? (
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground border-2 border-foreground rounded-full px-3 py-1 text-xs font-bold">
            <Mail className="w-3 h-3" /> Sent · code {p.code}
          </div>
        ) : (
          <form action={approveAction}>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard rounded-xl h-10 font-bold hover:bg-primary/90"
            >
              <Heart className="w-4 h-4 mr-1 fill-current" /> Approve €15 perk
            </Button>
          </form>
        )}
      </div>

      {isApproved && (
        <div className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
          <Check className="w-3 h-3 text-primary" /> Emailed to guest
        </div>
      )}
    </div>
  );
}
