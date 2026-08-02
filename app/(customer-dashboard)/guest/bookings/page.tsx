import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { format, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import type { PropertyData } from "@/lib/prisma-types";

export default async function GuestBookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: { property: true },
    orderBy: { startDate: "desc" },
  });

  const now = new Date();
  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);

  const mappedBookings = bookings.map((b) => {
    let when: "past" | "current" | "upcoming" = "upcoming";
    if (isBefore(b.endDate, startOfToday)) {
      when = "past";
    } else if (isBefore(b.startDate, endOfToday) && isAfter(b.endDate, startOfToday)) {
      when = "current";
    }

    let photo = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
    let location = "Unknown Location";
    let room = "Standard Room";
    
    if (b.property.landingPageJson) {
      const data = b.property.landingPageJson as unknown as PropertyData;
      location = data.location || location;
      if (data.rooms && data.rooms.length > 0) {
        room = data.rooms[0].name;
        if (data.rooms[0].photos && data.rooms[0].photos.length > 0) {
          photo = data.rooms[0].photos[0];
        }
      }
    }

    return {
      id: b.id,
      stay: b.property.name,
      location,
      photo,
      room,
      from: b.startDate.toISOString(),
      to: b.endDate.toISOString(),
      total: b.totalPrice,
      when,
    };
  });

  const groups: { key: "current" | "upcoming" | "past"; label: string; note: string }[] = [
    { key: "current", label: "Current stay", note: "You're there right now" },
    { key: "upcoming", label: "Upcoming bookings", note: "Bags not packed yet" },
    { key: "past", label: "Past bookings", note: "Completed stays" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="font-hand text-2xl text-accent">your trips</p>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold leading-tight">My Bookings</h1>
      </div>

      <div className="space-y-12">
        {groups.map((g) => {
          const rows = mappedBookings.filter((b) => b.when === g.key);
          return (
            <section key={g.key}>
              <div className="flex items-baseline gap-2 mb-4">
                <h3 className="font-display text-2xl font-extrabold">{g.label}</h3>
                <span className="text-xs text-muted-foreground">{g.note}</span>
              </div>
              {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground hand-border bg-white p-4">Nothing here yet.</p>
              ) : (
                <div className="space-y-4">
                  {rows.map((b) => (
                    <div key={b.id} className="hand-border bg-white overflow-hidden flex flex-wrap sm:flex-nowrap items-stretch">
                      <img src={b.photo} alt={b.stay} loading="lazy" className="w-full sm:w-48 h-32 sm:h-auto object-cover border-b-2 sm:border-b-0 sm:border-r-2 border-foreground" />
                      <div className="p-4 sm:p-5 flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                          <MapPin className="w-3 h-3" /> {b.location}
                        </div>
                        <p className="font-display text-2xl font-extrabold leading-tight">{b.stay}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {b.room} · {format(new Date(b.from), "d MMM")} – {format(new Date(b.to), "d MMM yyyy")}
                        </p>
                      </div>
                      <div className="p-4 sm:p-5 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t-2 sm:border-t-0 sm:border-l-2 border-foreground w-full sm:w-auto bg-cream/30">
                        <span className="font-display font-extrabold text-xl">€{b.total}</span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-foreground px-2 py-0.5",
                          b.when === "past" ? "bg-white" : b.when === "current" ? "bg-primary text-primary-foreground" : "bg-mustard",
                        )}>
                          {b.when === "past" ? "Completed" : b.when === "current" ? "Staying now" : "Upcoming"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
