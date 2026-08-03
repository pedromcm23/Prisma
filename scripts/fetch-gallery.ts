import "dotenv/config";
import { prisma } from "../lib/prisma";

const search = async (query: string) => {
  const safeQuery = query.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const res = await fetch('https://unsplash.com/s/photos/' + safeQuery);
  const html = await res.text();
  const ids = [...html.matchAll(/photo-([a-zA-Z0-9\-]{20,})/g)].map(m => m[1]);
  return Array.from(new Set(ids)).slice(0, 4).map(id => 'https://images.unsplash.com/photo-' + id + '?q=80&w=1200&auto=format&fit=crop');
};

const fallbacks = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1de24244b4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"
];

async function main() {
  const properties = await prisma.property.findMany();
  for (const p of properties) {
    console.log(`Updating ${p.name}...`);
    try {
      // Try to find specific photos for this property name
      let photos = await search(p.name + " " + (p.description || "interior"));
      if (photos.length < 4) {
        // Fallback to searching just the location
        photos = [...photos, ...(await search(p.description || "apartment"))];
      }
      
      // Ensure we have exactly 4 photos
      const uniquePhotos = Array.from(new Set(photos));
      while (uniquePhotos.length < 4) {
        uniquePhotos.push(fallbacks[uniquePhotos.length % fallbacks.length]);
      }
      const finalPhotos = uniquePhotos.slice(0, 4);

      const json: any = p.landingPageJson;
      if (json && json.rooms && json.rooms[0]) {
        json.rooms[0].photos = finalPhotos;
        await prisma.property.update({
          where: { id: p.id },
          data: { landingPageJson: json }
        });
        console.log(`✅ Saved 4 photos for ${p.name}`);
      }
    } catch (e) {
      console.error(`❌ Failed ${p.name}`, e);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
