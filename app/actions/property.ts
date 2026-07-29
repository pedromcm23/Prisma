"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

      return {
        slug: p.id, // using id as slug for now
        name: p.name,
        location: p.description || "Unknown Location",
        neighborhood: "City Center", // Placeholder since schema lacks neighborhood
        tagline: p.description?.substring(0, 50) || "A beautiful stay",
        price: 150, // Placeholder
        rating: 5.0, // Placeholder
        hostName: p.host.name || "Unknown Host",
        tags: ["Cozy", "WiFi"], // Placeholder
        color: "from-primary to-mustard", // Placeholder
        image,
        lat: 50, // Placeholder
        lng: 50, // Placeholder
      };
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
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
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      landingPageJson: designJson,
      landingPageHtml: html,
    }
  });
  return true;
}

export async function saveBoutiqueSite(data: any, kit: any, fallbackHostId: string) {
  const session = await auth();
  let hostId = fallbackHostId;

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
