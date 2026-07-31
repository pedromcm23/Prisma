import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { HotelWebsite } from "@/components/prisma/HotelWebsite";
import { emptyData, type PropertyData } from "@/lib/prisma-types";

export default async function PublicPropertyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let property = null;
  try {
    property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { host: true },
    });
  } catch (e) {
    // ID might be a slug and not a valid CUID, which causes Prisma to throw
  }

  if (!property) {
    // Fallback to searching by slug (normalized name) since frontend generates URLs by name
    try {
      const all = await prisma.property.findMany({ include: { host: true } });
      property = all.find((p) => {
        const slug = (p.name || "your-stay").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return slug === params.id;
      }) || null;
    } catch (e) {
      console.error("Failed to query DB for slug:", e);
    }
  }

  if (!property) {
    const { SAMPLE_LISTINGS } = await import("@/lib/prisma-types");
    const sample = SAMPLE_LISTINGS.find(s => s.slug === params.id);
    if (sample) {
      property = {
        id: sample.slug,
        name: sample.name,
        description: sample.location,
        hostId: "mock",
        createdAt: new Date(),
        updatedAt: new Date(),
        landingPageHtml: null,
        brandKitJson: null,
        landingPageJson: {
          name: sample.name,
          location: sample.location,
          tagline: sample.tagline,
          hostName: sample.hostName,
          rooms: [{
            name: "Main Room",
            price: sample.price,
            photos: sample.image ? [sample.image] : [],
            amenities: sample.tags || []
          }]
        } as any
      };
    }
  }

  if (!property) {
    notFound();
  }

  // Parse JSON or provide fallback empty data
  let data: PropertyData;
  try {
    const json = property.landingPageJson as any;
    data = { ...emptyData(), ...(json || {}) };
  } catch {
    data = emptyData();
  }

  // Ensure minimum structure for data to prevent runtime crashes
  data.name = property.name || data.name || "Your Stay";
  data.hostName = property.host?.name || data.hostName || "Unknown Host";
  data.location = property.description || data.location || "";
  data.specials = data.specials || ["Amazing location", "Great views", "Local vibe"];
  data.directions = data.directions || emptyData().directions;
  data.reviews = data.reviews || emptyData().reviews;
  data.rooms = data.rooms || emptyData().rooms;
  if (!data.rooms || !data.rooms.length) {
    data.rooms = [{ name: "Standard Room", price: 100, amenities: [], photos: [] }];
  }

  return (
    <HotelWebsite data={data} />
  );
}
