import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany();
  
  for (const property of properties) {
    if (property.name === "Casa Amarela") {
      let json = property.landingPageJson as any;
      if (!json) json = {};
      if (!json.rooms) json.rooms = [{}];
      if (!json.rooms[0].photos) json.rooms[0].photos = [];
      // Setting a cozy yellow house image from Unsplash
      json.rooms[0].photos[0] = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop";
      
      await prisma.property.update({
        where: { id: property.id },
        data: { landingPageJson: json }
      });
      console.log("Updated Casa Amarela");
    } else if (property.name === "Riad Nour") {
      let json = property.landingPageJson as any;
      if (!json) json = {};
      if (!json.rooms) json.rooms = [{}];
      if (!json.rooms[0].photos) json.rooms[0].photos = [];
      // Setting a riad image
      json.rooms[0].photos[0] = "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop";
      
      await prisma.property.update({
        where: { id: property.id },
        data: { landingPageJson: json }
      });
      console.log("Updated Riad Nour");
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
