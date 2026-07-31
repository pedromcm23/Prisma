"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createBooking(propertyId: string, startDateIso: string, endDateIso: string, totalPrice: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const startDate = new Date(startDateIso);
  const endDate = new Date(endDateIso);
  
  if (startDate >= endDate) {
    throw new Error("Invalid dates");
  }

  // Ensure dates are not blocked or already booked
  const blocked = await prisma.blockedDate.findFirst({
    where: {
      propertyId,
      isBlocked: true,
      date: {
        gte: startDate,
        lt: endDate
      }
    }
  });

  if (blocked) {
    throw new Error("Some of these dates are not available.");
  }

  // Check existing bookings overlap
  const overlap = await prisma.booking.findFirst({
    where: {
      propertyId,
      status: "CONFIRMED",
      AND: [
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } }
      ]
    }
  });

  if (overlap) {
    throw new Error("These dates are already booked.");
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      propertyId,
      customerId: session.user.id,
      startDate,
      endDate,
      totalPrice,
      status: "CONFIRMED"
    }
  });

  return booking;
}
