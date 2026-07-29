import { auth } from "@/auth";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function FlashDeals() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Flash Deals</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your last-minute inventory and spontaneous escapes.</p>
      </div>

      <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 border-2 border-foreground rounded-full flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-extrabold mb-2">No active flash deals</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Have an empty room tonight or tomorrow? Drop the price by 20% and offer a free perk to get it booked instantly by our spontaneous travelers.
        </p>
        <Button className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold rounded-xl px-6" disabled>
          Create Flash Deal (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
