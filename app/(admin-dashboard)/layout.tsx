import Link from "next/link";
import { Sparkles, Users, FileText, Settings } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/admin/hosts");
  }

  // Real-time DB check to ensure role is ADMIN
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/search");
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-foreground bg-white hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b-2 border-foreground">
          <Link href="/admin/hosts" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-foreground shadow-hard-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold">Prisma <span className="text-red-500 text-sm">Admin</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 font-bold text-sm">
          <Link href="/admin/hosts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
            <Users className="w-4 h-4" /> Hosts Management
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
            <FileText className="w-4 h-4" /> Landing Pages
          </Link>
        </nav>

        <div className="p-4 border-t-2 border-foreground space-y-2 font-bold text-sm">
          <Link href="/search" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            Switch to Guest
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b-2 border-foreground bg-white/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="md:hidden font-display font-extrabold text-xl text-red-500">Prisma Admin</div>
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
