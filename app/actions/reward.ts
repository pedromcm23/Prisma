"use server";

import { prisma } from "@/lib/prisma";

export async function submitReward(postLink: string, followerCount: number) {
  // In a real app we'd get customerId from session
  // For now we assume a dummy or find first CUSTOMER
  const customer = await prisma.user.findFirst({ where: { role: "CUSTOMER" } }) 
    || await prisma.user.create({ data: { name: "Demo Guest", email: "guest@prisma.com", role: "CUSTOMER" } });

  let points = 0;
  if (followerCount > 1000) points = 50;
  else if (followerCount > 100) points = 10;
  else points = 5;

  const reward = await prisma.rewardPoint.create({
    data: {
      customerId: customer.id,
      postLink,
      followerCount,
      pointsAwarded: points,
    }
  });

  return reward;
}
