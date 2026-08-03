import Link from "next/link";
import { Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { AppHeader } from "@/components/app-header";
import { SidebarNav } from "./SidebarNav";

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
      <AppHeader user={session?.user} role={dbUser?.role || "HOST"} />

      {/* Main Flex Layout */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 flex flex-col md:flex-row gap-6 flex-1">
        {/* Floating Sidebar */}
        <aside className="w-full md:w-[240px] md:shrink-0 md:sticky md:top-24 md:self-start">
          <div className="hand-border bg-white p-2">
            <p className="px-3 pt-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Host dashboard</p>
            <SidebarNav />
          </div>
        </aside>

        {/* Page Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <footer className="border-t-2 border-foreground bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold">Prisma</p>
          <p className="font-hand text-lg">made with ♡ for independent hosts</p>
        </div>
      </footer>
    </div>
  );
}
