import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, ArrowRight, Paintbrush, Euro } from "lucide-react";
import { upgradeToHost } from "@/app/actions/user";

export default function HostOnboarding() {
  return (
    <div className="min-h-screen bg-cream selection:bg-mustard selection:text-ink">
      {/* Nav */}
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-2xl font-display font-extrabold">Prisma</span>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-20 text-center">
        <p className="font-hand text-3xl text-primary">join the collective</p>
        <h1 className="mt-4 text-5xl sm:text-7xl font-display font-extrabold leading-[0.95]">
          Your boutique,<br /> your rules.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Prisma is the independent platform for hosts who care about design and hospitality. 
          Build your stunning website, take direct bookings, and pay zero commission.
        </p>

        <form action={upgradeToHost} className="mt-12">
          <Button 
            type="submit"
            className="h-16 px-10 text-xl rounded-2xl bg-primary text-primary-foreground border-2 border-foreground shadow-hard-lg font-bold hover:scale-105 hover:bg-primary/90 transition-transform"
          >
            Become a Prisma Host <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </form>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24 grid sm:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-mustard border-2 border-foreground shadow-hard flex items-center justify-center mb-6">
            <Paintbrush className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold">Stunning Design</h3>
          <p className="mt-2 text-muted-foreground">
            Say goodbye to boring templates. Our builder creates a unique aesthetic for your property.
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-ocean text-white border-2 border-foreground shadow-hard flex items-center justify-center mb-6">
            <Euro className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold">0% Commission</h3>
          <p className="mt-2 text-muted-foreground">
            Keep 100% of your earnings. Direct bookings mean you build direct relationships.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground border-2 border-foreground shadow-hard flex items-center justify-center mb-6">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-display font-bold">Independent</h3>
          <p className="mt-2 text-muted-foreground">
            You own your guest data and your brand. No more algorithmic punishment.
          </p>
        </div>
      </section>
    </div>
  );
}
