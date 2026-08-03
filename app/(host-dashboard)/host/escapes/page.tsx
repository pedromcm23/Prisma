import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CalendarPanel } from "./CalendarPanel";
import { PropertySelector } from "../preview/property-selector";
import { eachDayOfInterval, subDays } from "date-fns";

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
    select: { id: true, name: true, landingPageJson: true }
  });

  let activeId = properties[0]?.id;
  if (searchParams.id && properties.some(p => p.id === searchParams.id)) {
    activeId = searchParams.id;
  }

  let initialBlocked: string[] = [];
  let initialSpontaneous: string[] = [];
  let bookedDates: string[] = [];
  
  if (activeId) {
    const blocked = await prisma.blockedDate.findMany({
      where: { propertyId: activeId }
    });
    
    initialBlocked = blocked.filter(b => b.isBlocked).map(b => b.date.toISOString().split('T')[0]);
    initialSpontaneous = blocked.filter(b => b.isSpontaneous).map(b => b.date.toISOString().split('T')[0]);

    const bookings = await prisma.booking.findMany({
      where: { propertyId: activeId, status: "CONFIRMED" }
    });

    bookings.forEach(b => {
      if (b.startDate >= b.endDate) return;
      const days = eachDayOfInterval({ start: b.startDate, end: subDays(b.endDate, 1) });
      days.forEach(d => bookedDates.push(d.toISOString().split('T')[0]));
    });
  }

  const activeProperty = properties.find(p => p.id === activeId);
  let monthlyPrices: Record<string, number> = {};
  if (activeProperty?.landingPageJson) {
    const json = activeProperty.landingPageJson as any;
    if (json.monthlyPrices) {
      monthlyPrices = json.monthlyPrices;
    }
  }

  return (
    <div>
      <CalendarPanel 
        key={activeId || 'none'} 
        properties={properties} 
        activeId={activeId} 
        initialBlocked={initialBlocked}
        initialSpontaneous={initialSpontaneous}
        bookedDates={bookedDates}
        initialMonthlyPrices={monthlyPrices}
      />
    </div>
  );
}
