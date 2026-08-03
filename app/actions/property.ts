"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SAMPLE_LISTINGS } from "@/lib/prisma-types";

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

      return {
        slug: slug, // using name-based slug for pretty URLs
        name: p.name,
        location: p.description || "Unknown Location",
        neighborhood: "City Center", // Placeholder since schema lacks neighborhood
        tagline: p.description?.substring(0, 50) || "A beautiful stay",
        price: json?.rooms?.[0]?.price ?? json?.basePrice ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.price ?? 150,
        rating: SAMPLE_LISTINGS.find(s => s.name === p.name)?.rating ?? (4.7 + Math.random() * 0.3),
        hostName: p.host.name || "Unknown Host",
        tags: ["Cozy", "WiFi"], // Placeholder
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const spontaneousDates = await prisma.blockedDate.findMany({
      where: {
        isSpontaneous: true,
        date: {
          gte: today,
          lt: dayAfter
        }
      },
      include: {
        property: {
          include: {
            host: { select: { name: true } }
          }
        }
      }
    });

    // Deduplicate properties
    const uniqueProps = new Map();
    spontaneousDates.forEach(sd => {
      if (!uniqueProps.has(sd.property.id)) {
        uniqueProps.set(sd.property.id, { property: sd.property, firstDate: sd.date });
      }
    });

    const results = Array.from(uniqueProps.values()).map(({ property: p, firstDate }) => {
      const json = p.landingPageJson as any;
      const image = json?.rooms?.[0]?.photos?.[0] || null;
      const slug = p.id;
      const price = json?.rooms?.[0]?.price || json?.basePrice || 150;
      const discount = 0.2;
      const dealPrice = Math.round(price * (1 - discount));
      const isToday = firstDate.getTime() === today.getTime();
      const hoursLeft = isToday ? 24 - new Date().getHours() : 48 - new Date().getHours();

      return {
        slug: slug,
        name: p.name,
        location: p.description || "Unknown Location",
        neighborhood: "City Center",
        tagline: p.description?.substring(0, 50) || "A beautiful stay",
        price: price,
        originalPrice: price,
        dealPrice: dealPrice,
        rating: SAMPLE_LISTINGS.find(s => s.name === p.name)?.rating ?? (4.7 + Math.random() * 0.3),
        hostName: p.host.name || "Unknown Host",
        tags: ["Cozy", "WiFi"],
        color: "from-primary to-mustard",
        image,
        lat: json?.lat ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.lat ?? 38.7223,
        lng: json?.lng ?? SAMPLE_LISTINGS.find(s => s.name === p.name)?.lng ?? -9.1393,
        hoursLeft,
        perks: ["Free late checkout (2pm)", "Welcome drinks on the terrace"],
        window: isToday ? "Tonight" : "Tomorrow",
      };
    });

    return results;
  } catch (error) {
    console.error("Error fetching spontaneous properties:", error);
    return [];
  }
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
