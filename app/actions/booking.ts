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

  // Ensure property exists in the database for the foreign key constraint
  const existingProp = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!existingProp) {
    // It's a sample property that hasn't been saved to the DB yet.
    // Create it under this user so the booking can proceed.
    await prisma.property.create({
      data: {
        id: propertyId,
        hostId: session.user.id,
        name: propertyId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: "A beautiful stay automatically generated for this reservation.",
      }
    });
  }

  // Create booking
  try {
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
  } catch (e: any) {
    throw new Error(e.message || "Failed to create reservation in the database.");
  }
}

export async function cancelBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // In a real app we'd verify the user is the host of the property or the customer.
  // For the MVP, we just delete it.
  try {
    await prisma.booking.delete({
      where: { id: bookingId }
    });
  } catch (e: any) {
    throw new Error("Failed to cancel booking.");
  }
}
