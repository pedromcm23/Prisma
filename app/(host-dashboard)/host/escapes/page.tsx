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
      const days = eachDayOfInterval({ start: b.startDate, end: b.endDate });
      const stringDays = days.map(d => d.toISOString().split('T')[0]);
      
      stringDays.forEach(d => bookedDates.push(d));

      // If the booking started as a flash deal (or contained a flash deal date), visually mark the whole stay as a flash deal (including checkout day)
      const isFlashDealBooking = stringDays.some(d => initialSpontaneous.includes(d));
      if (isFlashDealBooking) {
        stringDays.forEach(d => {
          if (!initialSpontaneous.includes(d)) {
            initialSpontaneous.push(d);
          }
        });
      }
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
