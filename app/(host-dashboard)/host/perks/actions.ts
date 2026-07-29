"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approvePerk(perkId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const perk = await prisma.guestPerk.findUnique({ where: { id: perkId } });
  if (!perk || perk.hostId !== session.user.id) {
    throw new Error("Perk not found or unauthorized");
  }

  const code = `PRISMA15-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  await prisma.guestPerk.update({
    where: { id: perkId },
    data: {
      status: "approved",
      code: code
    }
  });

  revalidatePath("/host/perks");
  return code;
}
