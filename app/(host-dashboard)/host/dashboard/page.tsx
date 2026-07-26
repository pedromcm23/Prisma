import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Home, Sparkles } from "lucide-react";
import { auth } from "@/auth";

export default async function HostDashboard() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-extrabold">Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
        <p className="mt-2 text-lg text-muted-foreground font-hand">
          Ready to build your boutique story?
        </p>
      </div>

      {/* Empty State / CTA */}
      <div className="w-full rounded-2xl border-2 border-dashed border-foreground/30 bg-white/50 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold">No properties yet</h2>
        <p className="mt-2 max-w-md text-muted-foreground mb-8">
          You haven't added any stays yet. Let's create your first boutique property website and start accepting direct bookings.
        </p>
        <Link href="/host/properties/new">
          <Button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground border-2 border-foreground shadow-hard-sm font-bold hover:bg-primary/90 hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 mr-2" /> Add your first property
          </Button>
        </Link>
      </div>

      {/* Quick Stats Placeholder */}
      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-foreground shadow-hard-sm p-6 rounded-2xl">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Earnings</div>
          <div className="text-4xl font-display font-extrabold">€0</div>
        </div>
        <div className="bg-white border-2 border-foreground shadow-hard-sm p-6 rounded-2xl">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Bookings</div>
          <div className="text-4xl font-display font-extrabold">0</div>
        </div>
        <div className="bg-white border-2 border-foreground shadow-hard-sm p-6 rounded-2xl">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Profile Views</div>
          <div className="text-4xl font-display font-extrabold">0</div>
        </div>
      </div>
    </div>
  );
}
