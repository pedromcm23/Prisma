import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import { emptyData, PropertyData } from "@/lib/prisma-types";
import { redirect } from "next/navigation";

export default async function PreviewWebsite() {
  const session = await auth();
  const hostId = session?.user?.id;

  if (!hostId) return null;

  const property = await prisma.property.findFirst({
    where: { hostId },
    orderBy: { createdAt: 'desc' }
  });

  let data: PropertyData;

  if (property && property.landingPageJson) {
    data = property.landingPageJson as unknown as PropertyData;
  } else {
    // Fallback to the exact Lovable mock data
    data = emptyData();
    data.name = "Casa Amarela";
    data.location = "Alfama, Lisbon";
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
      </div>
      <div className="bg-white">
        <BoutiqueSite data={data} setData={() => {}} onBack={() => {}} onPublish={async () => {}} isPublishing={false} />
      </div>
    </div>
  );
}
