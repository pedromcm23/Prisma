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

  let initialBlocked: string[] = [];
  let initialSpontaneous: string[] = [];
  
  if (activeId) {
    const blocked = await prisma.blockedDate.findMany({
      where: { propertyId: activeId }
    });
    
    initialBlocked = blocked.filter(b => b.isBlocked).map(b => b.date.toISOString().split('T')[0]);
    initialSpontaneous = blocked.filter(b => b.isSpontaneous).map(b => b.date.toISOString().split('T')[0]);
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
      <CalendarPanel 
        key={activeId || 'none'} 
        properties={properties} 
        activeId={activeId} 
        initialBlocked={initialBlocked}
        initialSpontaneous={initialSpontaneous}
      />
    </div>
  );
}
