import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PreviewClient } from "./preview-client";
import { emptyData, PropertyData } from "@/lib/prisma-types";
import { PropertySelector } from "./property-selector";

export default async function HostPreview(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) {
    return <div>Not authenticated</div>;
  }

  const properties = await prisma.property.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, landingPageJson: true }
  });

  let property = properties[0];
  if (searchParams.id) {
    const found = properties.find(p => p.id === searchParams.id);
    if (found) property = found;
  }

  let data: PropertyData;

  if (property && property.landingPageJson && Object.keys(property.landingPageJson).length > 0) {
    const json = property.landingPageJson as any;
    data = { ...emptyData(), ...json };
    data.name = json.name || property.name || "Your Stay";
    data.location = json.location || property.description || "";
    data.specials = data.specials || emptyData().specials;
    data.directions = data.directions || emptyData().directions;
    data.reviews = data.reviews || emptyData().reviews;
    data.rooms = data.rooms || emptyData().rooms;
    if (!data.rooms || !data.rooms.length) {
      data.rooms = [{ name: "Standard Room", price: 100, amenities: [], photos: [] }];
    }
  } else {
    // Fallback to the exact Lovable mock data
    data = emptyData();
    data.name = "Example Property";
    data.location = "City Center";
    data.tagline = "A sunlit hideaway on the old cobbled hill";
    data.specials = [
      "Homemade sourdough breakfast on the terrace",
      "Sunlit terracotta terrace with lemon trees",
      "Secret beach path just 5 minutes away",
    ];
    data.hostName = "Ana";
    data.hostInterests = "Surfing, Natural Wine, Local Pottery";
    data.hostLoves = "Secret sunset spot at São Jorge, morning bakery run to Fabrica";
    data.reviews = [
      { text: "Woke up to bells and warm bread. Never wanted to leave.", author: "Mira, Berlin", rating: 5 },
      { text: "The tiles, the light, the little cat. A whole vibe.", author: "Julián, CDMX", rating: 5 },
      { text: "Ana knew every good spot. Felt like visiting a friend.", author: "Sara, Rome", rating: 5 },
    ];
    data.rooms = [
      { name: "Garden Room", price: 120, amenities: ["Wi-Fi", "Terrace"], photos: [] }
    ];
  }

  return (
    <div className="bg-white hand-border overflow-hidden">
      <div className="p-4 border-b-2 border-foreground bg-mustard/20 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="ml-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</span>
        <PropertySelector properties={properties} activeId={property?.id} basePath="/host/preview" />
      </div>
      <div className="bg-white">
        <PreviewClient key={property?.id || "fallback"} initialData={data} propertyId={property?.id} />
      </div>
    </div>
  );
}
