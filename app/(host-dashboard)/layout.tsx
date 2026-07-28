import Link from "next/link";
import { Sparkles, LayoutDashboard, Home, BookOpen, Euro, Settings, Gift, Zap } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";

export default async function HostDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/host/dashboard");
  }

  // Real-time DB check to ensure role is HOST
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "HOST") {
    redirect("/host/onboarding");
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-foreground bg-white hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b-2 border-foreground">
          <Link href="/host/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold">Prisma <span className="text-primary text-sm">Host</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 font-bold text-sm">
          <Link href="/host/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-mustard border-2 border-foreground shadow-hard-sm">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/host/properties" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
            <Home className="w-4 h-4" /> My Properties
          </Link>
          <Link href="/host/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
            <BookOpen className="w-4 h-4" /> Bookings
          </Link>
          <Link href="/host/perks" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
            <Gift className="w-4 h-4" /> Guest Perks
          </Link>
          <Link href="/host/escapes" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
            <Zap className="w-4 h-4" /> Flash Deals
          </Link>
        </nav>

        <div className="p-4 border-t-2 border-foreground space-y-2 font-bold text-sm">
          <Link href="/search" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            Switch to Guest
          </Link>
          <Link href="/host/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b-2 border-foreground bg-white/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="md:hidden font-display font-extrabold text-xl">Prisma Host</div>
          <div className="ml-auto">
            <UserNav user={session.user} />
          </div>
        </header>
        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
