"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getHostPerks() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HOST") {
    throw new Error("Unauthorized");
  }

  const perks = await prisma.guestPerk.findMany({
    where: { hostId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return perks;
}

export async function approvePerk(perkId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HOST") {
    throw new Error("Unauthorized");
  }

  const code = "PRISMA-" + Math.random().toString(36).slice(2, 7).toUpperCase();

  await prisma.guestPerk.updateMany({
    where: { 
      id: perkId,
      hostId: session.user.id // Ensure they own it
    },
    data: {
      status: "approved",
      code,
    }
  });

  revalidatePath("/host/perks");
  return code;
}

export async function seedDemoPerks() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HOST") {
    throw new Error("Unauthorized");
  }

  // Find if they have any properties
  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id },
  });

  const stayName = property ? property.name : "Your Boutique Stay";

  // Check if they already have perks to avoid duplicate seeding
  const existing = await prisma.guestPerk.count({
    where: { hostId: session.user.id }
  });

  if (existing === 0) {
    await prisma.guestPerk.createMany({
      data: [
        {
          hostId: session.user.id,
          stayName,
          guestName: "Elena",
          guestEmail: "elena@example.com",
          postUrl: "https://instagram.com/elena/p/123",
          note: "Absolutely magical. The host left fresh figs and hand-drawn maps to their favorite spots.",
          status: "pending",
        },
        {
          hostId: session.user.id,
          stayName,
          guestName: "Tomás",
          guestEmail: "tomas@example.com",
          postUrl: "https://tiktok.com/@tomas/video/456",
          note: "You can feel the love in every corner. Best coffee I've had on a terrace, ever.",
          status: "pending",
        }
      ]
    });
  }

  revalidatePath("/host/perks");
}
