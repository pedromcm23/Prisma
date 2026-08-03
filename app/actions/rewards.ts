"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Calculate user's current point balance
export async function getUserBalance() {
  const session = await auth();
  if (!session?.user?.id) return 0;
  
  const transactions = await prisma.rewardTransaction.findMany({
    where: { 
      userId: session.user.id,
      status: "APPROVED" 
    },
  });
  
  return transactions.reduce((sum, tx) => sum + tx.points, 0);
}

// Automatically process 500 points for stays that ended and haven't been rewarded yet
export async function autoProcessCompletedStays() {
  const session = await auth();
  if (!session?.user?.id) return;
  
  const userId = session.user.id;
  
  // Find all confirmed bookings where the end date has passed
  const pastBookings = await prisma.booking.findMany({
    where: {
      customerId: userId,
      status: "CONFIRMED",
      endDate: {
        lt: new Date()
      }
    }
  });

  for (const booking of pastBookings) {
    // Check if a reward transaction already exists for this booking ID
    const existing = await prisma.rewardTransaction.findFirst({
      where: {
        userId,
        type: "STAY",
        note: booking.id
      }
    });
    
    if (!existing) {
      await prisma.rewardTransaction.create({
        data: {
          userId,
          points: 500,
          type: "STAY",
          status: "APPROVED",
          note: booking.id
        }
      });
      // Optionally update booking status to COMPLETED
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "COMPLETED" }
      });
    }
  }
}

// Redeem 1000 points for a €50 discount
export async function redeemPoints() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const balance = await getUserBalance();
  if (balance < 1000) {
    throw new Error("Insufficient points");
  }
  
  await prisma.rewardTransaction.create({
    data: {
      userId: session.user.id,
      points: -1000,
      type: "REDEEM",
      status: "APPROVED",
      note: "€50 Discount Coupon"
    }
  });
  
  revalidatePath("/guest/rewards");
  return { success: true, message: "Coupon generated successfully!" };
}

// Submit a social media post for host approval
export async function submitSocialMediaPost(postUrl: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  // For MVP, we can link the post to any recent host the guest stayed with, or leave propertyId null.
  // If the user selects the property in the UI, we would pass propertyId. Here we just grab the last booking.
  const lastBooking = await prisma.booking.findFirst({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" }
  });
  
  await prisma.rewardTransaction.create({
    data: {
      userId: session.user.id,
      points: 250,
      type: "SOCIAL",
      status: "PENDING",
      note: postUrl,
      propertyId: lastBooking?.propertyId || null
    }
  });
  
  revalidatePath("/guest/rewards");
  return { success: true };
}

// For Hosts: Approve a pending social media transaction
export async function approveTransaction(transactionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  // Verify the host owns the property linked to this transaction
  const tx = await prisma.rewardTransaction.findUnique({
    where: { id: transactionId },
    include: { user: true }
  });
  
  if (!tx || tx.status !== "PENDING") {
    throw new Error("Invalid transaction");
  }
  
  if (tx.propertyId) {
    const prop = await prisma.property.findUnique({ where: { id: tx.propertyId } });
    if (prop?.hostId !== session.user.id) {
      throw new Error("Unauthorized: not your property");
    }
  }
  
  await prisma.rewardTransaction.update({
    where: { id: transactionId },
    data: { status: "APPROVED" }
  });
  
  revalidatePath("/host/perks");
  return { success: true };
}
