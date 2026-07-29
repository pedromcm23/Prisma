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

  if (dbUser && dbUser.role !== "HOST") {
    // Auto-upgrade them since they reached the host dashboard
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "HOST" }
    });
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Global Host Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b-2 border-foreground shadow-hard-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <Link href="/host/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold">Prisma <span className="text-primary text-sm">Host</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-hard-sm bg-primary text-primary-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-current" /> Now Host
            </span>
            <UserNav user={session.user} />
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6 flex-1">
        {/* Floating Sidebar */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="hand-border bg-white p-2 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Host dashboard</p>
            
            <Link href="/host/dashboard" className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold hover:bg-mustard/30 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link href="/host/properties" className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold hover:bg-mustard/30 transition-colors">
              <Home className="w-4 h-4" /> Properties
            </Link>
            <Link href="/host/bookings" className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold hover:bg-mustard/30 transition-colors">
              <BookOpen className="w-4 h-4" /> Bookings
            </Link>
            <Link href="/host/escapes" className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold hover:bg-mustard/30 transition-colors">
              <Zap className="w-4 h-4" /> Calendar & Escapes
            </Link>
            <Link href="/host/perks" className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold hover:bg-mustard/30 transition-colors">
              <Gift className="w-4 h-4" /> Guest Perks
            </Link>

            <div className="pt-2 mt-2 border-t border-foreground/10">
              <Link href="/host/settings" className="w-full text-left flex items-center gap-2 px-3 h-10 rounded-lg text-sm font-bold hover:bg-mustard/30 transition-colors text-muted-foreground">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
