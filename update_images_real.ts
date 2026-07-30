import { prisma } from "./lib/prisma";

async function main() {
  const properties = await prisma.property.findMany();
  for (const p of properties) {
    if (p.name.toLowerCase().includes("casa amarel")) {
      const json = p.landingPageJson as any;
      if (json && json.rooms && json.rooms[0]) {
        json.rooms[0].photos = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"];
        await prisma.property.update({
          where: { id: p.id },
          data: { landingPageJson: json }
        });
        console.log(`Updated DB image for ${p.name} (id: ${p.id})`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
