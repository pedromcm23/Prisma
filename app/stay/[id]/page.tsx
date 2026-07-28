import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BoutiqueSite } from "@/components/prisma/BoutiqueSite";
import { themeToBrandKit } from "@/lib/brand-kit";
import { emptyData, type PropertyData } from "@/lib/prisma-types";

export default async function PublicPropertyPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    notFound();
  }

  // Parse JSON or provide fallback empty data
  let data: PropertyData;
  try {
    data = (property.landingPageJson as any) || emptyData();
  } catch {
    data = emptyData();
  }

  // Ensure minimum structure for data to prevent runtime crashes
  data.name = property.name || data.name || "Your Stay";
  data.location = property.description || data.location || "";
  if (!data.rooms || !data.rooms.length) {
    data.rooms = [{ name: "Standard Room", price: 100, amenities: [], photos: [] }];
  }

  // Parse Brand Kit or use default theme
  let brandKit = themeToBrandKit("folk-pop");
  if (property.brandKitJson) {
    try {
      const dbKit = property.brandKitJson as any;
      if (dbKit && dbKit.themeId) {
        brandKit = dbKit;
      }
    } catch {}
  }

  return (
    <BoutiqueSite 
      data={data} 
      setData={() => {}} 
      readOnly={true} 
      initialBrandKit={brandKit}
    />
  );
}
