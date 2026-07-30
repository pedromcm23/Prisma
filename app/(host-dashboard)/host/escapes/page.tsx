import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CalendarPanel } from "./CalendarPanel";

export default async function FlashDeals({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  const properties = await prisma.property.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true }
  });

  let activeId = properties[0]?.id;
  if (searchParams.id && properties.some(p => p.id === searchParams.id)) {
    activeId = searchParams.id;
  }

  return (
    <CalendarPanel key={activeId || 'none'} properties={properties} activeId={activeId} />
  );
}
