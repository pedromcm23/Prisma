import { prisma } from "@/lib/prisma";
import { emptyData, type PropertyData } from "@/lib/prisma-types";
import { BuilderClient } from "./builder-client";
import { auth } from "@/auth";

export default async function BuilderPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const hostId = session?.user?.id;
  
  let initialData: PropertyData = (() => {
    const d = emptyData();
    d.name = "";
    d.location = "";
    d.tagline = "";
    d.specials = ["", "", ""];
    d.hostName = "";
    d.hostInterests = "";
    d.hostLoves = "";
    d.reviews = [
      { text: "", author: "", rating: 5 },
      { text: "", author: "", rating: 5 },
      { text: "", author: "", rating: 5 },
    ];
    d.rooms = [
      { name: "", price: 120, amenities: [], photos: [] }
    ];
    return d;
  })();

  let propertyId = undefined;

  if (searchParams.id && hostId) {
    const property = await prisma.property.findUnique({
      where: { id: searchParams.id }
    });
    
    // Ensure the host owns it
    if (property && property.hostId === hostId && property.landingPageJson) {
      propertyId = property.id;
      initialData = { ...initialData, ...(property.landingPageJson as any) };
    }
  }

  return (
    <BuilderClient initialData={initialData} propertyId={propertyId} />
  );
}
