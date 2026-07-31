"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBlockedDate(propertyId: string, dateIso: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify ownership
  const property = await prisma.property.findFirst({
    where: { id: propertyId, hostId: session.user.id }
  });
  if (!property) throw new Error("Property not found or unauthorized");

  const date = new Date(dateIso);

  const existing = await prisma.blockedDate.findUnique({
    where: { propertyId_date: { propertyId, date } }
  });

  if (existing) {
    if (existing.isBlocked) {
      // Unblock it
      await prisma.blockedDate.delete({
        where: { id: existing.id }
      });
    } else {
      // It was just a spontaneous escape flag without block? 
      // Update it to be blocked
      await prisma.blockedDate.update({
        where: { id: existing.id },
        data: { isBlocked: true }
      });
    }
  } else {
    // Block it
    await prisma.blockedDate.create({
      data: {
        propertyId,
        date,
        isBlocked: true,
        isSpontaneous: false
      }
    });
  }

  revalidatePath("/host/escapes");
  revalidatePath(`/stay/[id]`, 'page');
}

export async function toggleSpontaneousDate(propertyId: string, dateIso: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify ownership
  const property = await prisma.property.findFirst({
    where: { id: propertyId, hostId: session.user.id }
  });
  if (!property) throw new Error("Property not found or unauthorized");

  const date = new Date(dateIso);

  const existing = await prisma.blockedDate.findUnique({
    where: { propertyId_date: { propertyId, date } }
  });

  if (existing) {
    // Toggle spontaneous
    await prisma.blockedDate.update({
      where: { id: existing.id },
      data: { 
        isSpontaneous: !existing.isSpontaneous,
        isBlocked: true // ensure it stays blocked if they list it as an escape
      }
    });
  } else {
    // Create as blocked AND spontaneous
    await prisma.blockedDate.create({
      data: {
        propertyId,
        date,
        isBlocked: true,
        isSpontaneous: true
      }
    });
  }

  revalidatePath("/host/escapes");
  revalidatePath(`/stay/[id]`, 'page');
}
