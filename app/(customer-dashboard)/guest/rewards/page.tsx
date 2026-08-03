import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import type { PropertyData } from "@/lib/prisma-types";
import { RewardsClient } from "./rewards-client";
import { getUserBalance, autoProcessCompletedStays } from "@/app/actions/rewards";

export default async function RewardsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  // Auto process any unrewarded past stays
  await autoProcessCompletedStays();

  // Fetch real balance and transactions
  const balance = await getUserBalance();
  const transactions = await prisma.rewardTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } }
    }
  });

  // Fetch user to get referral code
  let user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.referralCode) {
    // Generate one if it doesn't exist
    const code = `PRISMA-${session.user.id.substring(0, 6).toUpperCase()}`;
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code }
    });
  }

  const mappedTransactions = transactions.map(tx => ({
    id: tx.id,
    points: tx.points,
    type: tx.type,
    status: tx.status,
    note: tx.note,
    date: tx.createdAt.toISOString()
  }));

  return <RewardsClient 
    balance={balance} 
    transactions={mappedTransactions} 
    referralCode={user?.referralCode || ""} 
  />;
}
