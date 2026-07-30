import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CalendarPanel } from "./CalendarPanel";
import { PropertySelector } from "../preview/property-selector";

export default async function FlashDeals(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
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
    <div>
      <div className="mb-4 flex items-center justify-between bg-white p-4 hand-border">
        <div>
          <p className="font-hand text-xl text-accent">Availability</p>
          <h2 className="text-2xl font-display font-extrabold">Calendar</h2>
        </div>
        <PropertySelector properties={properties} activeId={activeId} basePath="/host/escapes" />
      </div>
      <CalendarPanel key={activeId || 'none'} properties={properties} activeId={activeId} />
    </div>
  );
}
