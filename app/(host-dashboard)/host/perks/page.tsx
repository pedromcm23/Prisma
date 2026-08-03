import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PerkCard } from "./PerkCard";
import { Gift } from "lucide-react";

export default async function GuestPerks() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  // Find properties owned by this host
  const hostProperties = await prisma.property.findMany({
    where: { hostId },
    select: { id: true }
  });
  
  const hostPropertyIds = hostProperties.map(p => p.id);

  // Find all social media transactions pending for properties owned by this host
  const pendingTransactions = await prisma.rewardTransaction.findMany({
    where: { 
      type: "SOCIAL",
      propertyId: { in: hostPropertyIds }
    },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Guest Perks</h1>
        <p className="text-muted-foreground mt-2 text-lg">Review and approve "Share the Love" submissions from your guests to award them 250 points.</p>
      </div>

      {pendingTransactions.length === 0 ? (
        <div className="bg-white border-2 border-foreground shadow-hard rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-mustard/30 border-2 border-foreground rounded-full flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-extrabold mb-2">No perks submitted yet</h2>
          <p className="text-muted-foreground max-w-md">
            When guests share their stay on social media and submit the link, it will appear here for your approval.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingTransactions.map((tx) => (
            <PerkCard key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
