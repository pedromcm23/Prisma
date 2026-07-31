import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/app-header";
import { GuestPortal } from "@/components/prisma/GuestPortal";
import { redirect } from "next/navigation";
import { getProperties } from "@/app/actions/property";
import { SAMPLE_LISTINGS } from "@/lib/prisma-types";

export default async function Landing() {
  const session = await auth();
  
  let role = "GUEST";
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    if (dbUser) role = dbUser.role;
  }

  if (role === "HOST") {
    redirect("/host/dashboard");
  }

  let dbListings = SAMPLE_LISTINGS;
  try {
    const props = await getProperties();
    if (props && props.length > 0) {
      dbListings = props;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-cream text-foreground">
      <AppHeader user={session?.user} role={role} />
      <GuestPortal listings={dbListings} isAuthenticated={!!session} />

      <footer className="border-t-2 border-foreground bg-primary text-primary-foreground mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xl font-extrabold">Prisma</p>
          <p className="font-hand text-lg">made with ♡ for independent hosts</p>
        </div>
      </footer>
    </div>
  );
}
