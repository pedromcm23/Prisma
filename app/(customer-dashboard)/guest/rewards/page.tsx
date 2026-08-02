import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import type { PropertyData } from "@/lib/prisma-types";
import { RewardsClient } from "./rewards-client";

export default async function RewardsPage() {
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

    // Points are only awarded for past (completed) stays
    const pointsAwarded = when === "past";

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
      shared: false, // Will be overridden by localStorage if true
      pointsAwarded,
    };
  });

  return <RewardsClient initialBookings={mappedBookings} />;
}
