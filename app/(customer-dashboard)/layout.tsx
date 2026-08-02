import { AppHeader } from "@/components/app-header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  let role = "GUEST";
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    if (dbUser) role = dbUser.role;
  }

  return (
    <div className="min-h-screen bg-cream text-foreground flex flex-col">
      <AppHeader user={session?.user} role={role} />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t-2 border-foreground bg-primary text-primary-foreground mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold">Prisma</p>
          <p className="font-hand text-lg">made with ♡ for independent hosts</p>
        </div>
      </footer>
    </div>
  );
}
