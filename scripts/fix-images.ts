import "dotenv/config";
import { prisma } from "../lib/prisma";

const fixes: Record<string, string> = {
  "lisbon-alfama-flat": "https://images.unsplash.com/photo-1506125840744-167167210587?q=80&w=1200&auto=format&fit=crop",
  "ger-s-mountain-retreat": "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=1200&auto=format&fit=crop",
  "tuscan-stone-farmhouse": "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200&auto=format&fit=crop",
  "highlands-loch-cabin": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
  "parisian-elegance-apartment": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
  "london-chelsea-townhouse": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "sintra-mystical-retreat": "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=1200&auto=format&fit=crop",
  "nordic-geothermal-cabin": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
  "amsterdam-canal-house": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
};

async function main() {
  for (const [id, url] of Object.entries(fixes)) {
    const prop = await prisma.property.findUnique({ where: { id } });
    if (prop && prop.landingPageJson) {
      const json: any = prop.landingPageJson;
      if (json.rooms && json.rooms[0]) {
        json.rooms[0].photos = [url];
        await prisma.property.update({
          where: { id },
          data: { landingPageJson: json }
        });
        console.log(`Fixed image for ${id}`);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
