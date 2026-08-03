import "dotenv/config";
import { prisma } from "../lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const dataPath = path.join(__dirname, "properties-data.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const properties = JSON.parse(rawData);

  console.log(`Loaded ${properties.length} properties to seed.`);

  for (const p of properties) {
    let user = await prisma.user.findUnique({
      where: { email: p.hostEmail }
    });

    if (!user) {
      console.log(`Creating user ${p.hostEmail}...`);
      user = await prisma.user.create({
        data: {
          email: p.hostEmail,
          name: p.hostName,
          role: "HOST"
        }
      });
    }

    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const landingPageJson = {
      name: p.name,
      location: p.location,
      tagline: p.tagline,
      rooms: p.rooms,
      basePrice: p.price[0] || 150,
      monthlyPrices: p.price,
      specials: p.specials,
      directions: p.directions,
      reviews: Array(3).fill({ text: "Absolutely amazing stay, highly recommend!", author: "Guest", rating: p.rating }),
      hostName: p.hostName,
      hostInterests: p.hostInterests,
      hostLoves: p.hostLoves,
      lat: p.lat,
      lng: p.lng
    };

    const prop = await prisma.property.upsert({
      where: { id: slug },
      update: {
        name: p.name,
        description: p.location,
        landingPageJson: landingPageJson
      },
      create: {
        id: slug,
        name: p.name,
        description: p.location,
        hostId: user.id,
        landingPageJson: landingPageJson
      }
    });

    console.log(`Created/Updated property: ${prop.name} (${prop.id})`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
