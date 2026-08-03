"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SAMPLE_LISTINGS } from "@/lib/prisma-types";
import { format } from "date-fns";

export async function getProperties(options?: { take?: number }) {
  try {
    const properties = await prisma.property.findMany({
      take: options?.take,
      orderBy: { createdAt: "desc" },
      include: {
        host: {
          select: { name: true }
        }
      }
    });

    // Map Prisma schema to the expected frontend Listing format
    return properties.map(p => {
      const json = p.landingPageJson as any;
      const image = json?.rooms?.[0]?.photos?.[0] || null;
      const slug = (p.name || "your-stay").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        const basePrice = json?.rooms?.[0]?.price ?? json?.basePrice ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.price ?? 150;
        let displayPrice = basePrice;
        
        if (json?.monthlyPrices && Object.keys(json.monthlyPrices).length > 0) {
          let sum = 0;
          for (let i = 0; i < 12; i++) {
            sum += json.monthlyPrices[i] ?? basePrice;
          }
          displayPrice = Math.round(sum / 12);
        }

        return {
          slug: slug, // using name-based slug for pretty URLs
          name: p.name,
          location: p.description || "Unknown Location",
          neighborhood: "City Center", // Placeholder since schema lacks neighborhood
          tagline: p.description?.substring(0, 50) || "A beautiful stay",
          price: displayPrice,
          rating: SAMPLE_LISTINGS.find(s => s.name === p.name)?.rating ?? json?.reviews?.[0]?.rating ?? [4.5, 4.6, 4.7, 4.8, 4.9, 5.0][p.name.length % 6],
          hostName: p.host.name || "Unknown Host",
        tags: SAMPLE_LISTINGS.find(s => s.name === p.name)?.tags ?? json?.rooms?.[0]?.amenities?.slice(0, 3) ?? ["Cozy", "Unique"],
        color: "from-primary to-mustard", // Placeholder
        image,
        lat: json?.lat ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.lat ?? 38.7223,
        lng: json?.lng ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.lng ?? -9.1393,
      };
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function getSpontaneousProperties() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const spontaneousDates = await prisma.blockedDate.findMany({
      where: {
        isSpontaneous: true,
        date: {
          gte: today,
        }
      },
      orderBy: { date: 'asc' },
      include: {
        property: {
          include: {
            host: { select: { name: true } }
          }
        }
      }
    });

    // Group by contiguous blocks per property
    const propertyBlocks: any[] = [];
    const propertyDatesMap = new Map<string, any[]>();
    
    spontaneousDates.forEach(sd => {
      if (!propertyDatesMap.has(sd.property.id)) {
        propertyDatesMap.set(sd.property.id, []);
      }
      propertyDatesMap.get(sd.property.id)!.push(sd);
    });

    propertyDatesMap.forEach((dates) => {
      if (dates.length === 0) return;
      
      let currentBlock = {
        property: dates[0].property,
        firstDate: dates[0].date,
        lastDate: dates[0].date,
        dealPrice: dates[0].dealPrice
      };
      
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1].date);
        const currDate = new Date(dates[i].date);
        const nextDay = new Date(prevDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        if (currDate.toISOString().split('T')[0] === nextDay.toISOString().split('T')[0]) {
          currentBlock.lastDate = currDate;
        } else {
          propertyBlocks.push(currentBlock);
          currentBlock = {
            property: dates[i].property,
            firstDate: dates[i].date,
            lastDate: dates[i].date,
            dealPrice: dates[i].dealPrice
          };
        }
      }
      propertyBlocks.push(currentBlock);
    });

    const results = propertyBlocks.map(({ property: p, firstDate, lastDate, dealPrice: customDealPrice }) => {
      const json = p.landingPageJson as any;
      const image = json?.rooms?.[0]?.photos?.[0] || null;
      const slug = p.id;
      const basePrice = json?.rooms?.[0]?.price || json?.basePrice || 150;
      let displayPrice = basePrice;
      if (json?.monthlyPrices && Object.keys(json.monthlyPrices).length > 0) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          sum += json.monthlyPrices[i] ?? basePrice;
        }
        displayPrice = Math.round(sum / 12);
      }
      
      const discount = 0.2;
      const dealPrice = customDealPrice ?? Math.round(displayPrice * (1 - discount));
      const isToday = firstDate.getTime() === today.getTime();
      const isTomorrow = firstDate.getTime() === today.getTime() + 24 * 60 * 60 * 1000;
      
      let windowLabel = format(firstDate, "MMM d");
      if (lastDate.getTime() > firstDate.getTime()) {
         windowLabel += ` - ${format(lastDate, "MMM d")}`;
      } else {
         if (isToday) windowLabel = "Tonight";
         else if (isTomorrow) windowLabel = "Tomorrow";
      }

      return {
        slug: slug,
        name: p.name,
        location: p.description || "Unknown Location",
        neighborhood: "City Center",
        tagline: p.description?.substring(0, 50) || "A beautiful stay",
        price: displayPrice,
        originalPrice: displayPrice,
        dealPrice: dealPrice,
        rating: SAMPLE_LISTINGS.find(s => s.name === p.name)?.rating ?? json?.reviews?.[0]?.rating ?? [4.5, 4.6, 4.7, 4.8, 4.9, 5.0][p.name.length % 6],
        hostName: p.host.name || "Unknown Host",
        tags: SAMPLE_LISTINGS.find(s => s.name === p.name)?.tags ?? json?.rooms?.[0]?.amenities?.slice(0, 3) ?? ["Cozy", "Unique"],
        color: "from-primary to-mustard",
        image,
        lat: json?.lat ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.lat ?? 38.7223,
        lng: json?.lng ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.lng ?? -9.1393,
        hoursLeft: 24,
        perks: ["Flash Deal Discount", "Exclusive Bundle"],
        window: windowLabel,
        startDate: firstDate.toISOString().split('T')[0],
        endDate: lastDate.toISOString().split('T')[0],
      };
    });

    return results;
  } catch (error) {
    console.error("Error fetching spontaneous properties:", error);
    return [];
  }
}

export async function updateMonthlyPricing(propertyId: string, monthlyPrices: Record<string, number>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  
  if (!property || property.hostId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  
  const json = property.landingPageJson as any || {};
  json.monthlyPrices = monthlyPrices;
  
  await prisma.property.update({
    where: { id: propertyId },
    data: { landingPageJson: json }
  });
  
  return true;
}

export async function createProperty(name: string, description: string) {
  // In a real app we'd get hostId from session
  // For now we assume a dummy or find first user
  const host = await prisma.user.findFirst({ where: { role: "HOST" } }) 
    || await prisma.user.create({ data: { name: "Demo Host", email: "host@prisma.com", role: "HOST" } });

  const property = await prisma.property.create({
    data: {
      name,
      description,
      hostId: host.id,
    }
  });

  return property.id;
}

export async function savePropertyDesign(propertyId: string, designJson: any, html: string) {
  const name = designJson?.name || "Your Stay";
  const description = designJson?.location || "";

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      name,
      description,
      landingPageJson: designJson,
      landingPageHtml: html,
    }
  });
  return true;
}

export async function saveBoutiqueSite(data: any, kit: any, propertyId?: string) {
  const session = await auth();
  let hostId = "";

  if (session?.user?.id) {
    hostId = session.user.id;
    // Upgrade them to HOST automatically since they just created a site
    await prisma.user.update({
      where: { id: hostId },
      data: { role: "HOST" }
    }).catch(() => {}); // ignore if user doesn't exist in db for some reason
  }

  let host = await prisma.user.findUnique({ where: { id: hostId } });
  if (!host) {
    host = await prisma.user.findFirst({ where: { role: "HOST" } }) 
      || await prisma.user.create({ data: { name: "Demo Host", email: `host-${Math.random()}@prisma.com`, role: "HOST" } });
    hostId = host.id;
  }

  if (propertyId) {
    // Update existing property
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        name: data.name || "My Boutique Property",
        description: data.location || "Unknown Location",
        landingPageJson: data,
        brandKitJson: kit,
      }
    });
    return property.id;
  } else {
    // Create new property
    const property = await prisma.property.create({
      data: {
        name: data.name || "My Boutique Property",
        description: data.location || "Unknown Location",
        hostId: host?.id || hostId,
        landingPageJson: data,
        brandKitJson: kit,
      }
    });
    return property.id;
  }
}

import { revalidatePath } from "next/cache";

export async function deleteProperty(propertyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  // Verify ownership
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  
  if (!property || property.hostId !== session.user.id) {
    throw new Error("Unauthorized or not found");
  }
  
  await prisma.property.delete({
    where: { id: propertyId }
  });
  
  revalidatePath("/host/properties");
  revalidatePath("/host/preview");
  return true;
}
