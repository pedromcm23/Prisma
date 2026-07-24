"use server";

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
    return properties.map(p => ({
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
      lat: 50, // Placeholder
      lng: 50, // Placeholder
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
