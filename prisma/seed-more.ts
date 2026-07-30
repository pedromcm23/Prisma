import { prisma } from '../lib/prisma';
import { PropertyData, emptyData } from '../lib/prisma-types';

const NEW_PROPERTIES = [
  {
    name: "Riad Yasmine",
    location: "Marrakech, Morocco",
    tagline: "A green tiled oasis hidden away in the Medina.",
    hostName: "Yasmine",
    hostEmail: "yasmine@example.com",
    image: "https://images.unsplash.com/photo-1542314831-c6a4d1429d6d?q=80&w=2000&auto=format&fit=crop",
    rooms: [
      {
        name: "Emerald Suite",
        price: 180,
        amenities: ["Courtyard view", "King bed", "Hammam access"],
        photos: ["https://images.unsplash.com/photo-1542314831-c6a4d1429d6d?q=80&w=1200&auto=format&fit=crop"]
      },
      {
        name: "Rooftop Room",
        price: 140,
        amenities: ["City views", "Private terrace"],
        photos: ["https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop"]
      }
    ],
    specials: [
      "Traditional Moroccan breakfast served daily by the pool with fresh mint tea and local pastries.",
      "Access to our private hammam and spa for a truly relaxing escape.",
      "Exclusive rooftop dinners at sunset overlooking the Atlas mountains."
    ],
    tags: ["POOL", "MEDINA", "BREAKFAST"],
    theme: "folk-pop"
  },
  {
    name: "Masseria Moroseta",
    location: "Ostuni, Italy",
    tagline: "Modern minimalism wrapped in ancient olive groves.",
    hostName: "Carlo",
    hostEmail: "carlo@example.com",
    image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=2000&auto=format&fit=crop",
    rooms: [
      {
        name: "Courtyard Room",
        price: 250,
        amenities: ["Private garden", "Outdoor shower", "King bed"],
        photos: ["https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200&auto=format&fit=crop"]
      }
    ],
    specials: [
      "Wake up to the sound of cicadas and a farm-to-table Puglian breakfast.",
      "A stunning saltwater pool overlooking the olive trees and the Adriatic sea.",
      "Join our communal dinners featuring organic produce from our own farm."
    ],
    tags: ["POOL", "FARM", "PUGLIA"],
    theme: "editorial"
  },
  {
    name: "The Slow",
    location: "Canggu, Bali",
    tagline: "Tropical brutalism and laid-back island living.",
    hostName: "George",
    hostEmail: "george@example.com",
    image: "https://images.unsplash.com/photo-1522792851823-3812f0afaf86?q=80&w=2000&auto=format&fit=crop",
    rooms: [
      {
        name: "Pool Suite",
        price: 190,
        amenities: ["Plunge pool", "Floor-to-ceiling windows"],
        photos: ["https://images.unsplash.com/photo-1522792851823-3812f0afaf86?q=80&w=1200&auto=format&fit=crop"]
      }
    ],
    specials: [
      "In-room plunge pools enclosed by lush tropical greenery.",
      "An art gallery and restaurant on the ground floor curated by the founders.",
      "Steps away from Batu Bolong beach and the best surf spots."
    ],
    tags: ["SURF", "ART", "TROPICAL"],
    theme: "bold-brutalist"
  },
  {
    name: "Casa Cosmos",
    location: "Puerto Escondido, Mexico",
    tagline: "A brutalist concrete pavilion on a wild beach.",
    hostName: "Elena",
    hostEmail: "elena@example.com",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2000&auto=format&fit=crop",
    rooms: [
      {
        name: "Main Pavilion",
        price: 320,
        amenities: ["Open-air living", "Oceanfront", "Hammocks"],
        photos: ["https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"]
      }
    ],
    specials: [
      "Completely open to the elements, blurring the lines between inside and outside.",
      "A private pool integrated into the concrete terrace overlooking the Pacific.",
      "Remote, secluded, and designed for total disconnection."
    ],
    tags: ["BEACHFRONT", "NATURE", "ISOLATION"],
    theme: "calm-nature"
  }
];

async function main() {
  console.log("Seeding properties...");
  for (const p of NEW_PROPERTIES) {
    let user = await prisma.user.findUnique({ where: { email: p.hostEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: p.hostEmail,
          name: p.hostName,
          role: "HOST",
        }
      });
      console.log("Created user", user.email);
    }

    const propertyData: PropertyData = {
      ...emptyData(),
      name: p.name,
      location: p.location,
      tagline: p.tagline,
      hostName: p.hostName,
      rooms: p.rooms,
      specials: p.specials,
      basePrice: p.rooms[0].price,
    };

    const existing = await prisma.property.findFirst({
      where: { name: p.name }
    });

    if (existing) {
      console.log(`Property ${p.name} already exists. Skipping.`);
      continue;
    }

    const created = await prisma.property.create({
      data: {
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        hostId: user.id,
        landingPageJson: propertyData as any,
        brandKitJson: { themeId: p.theme },
      }
    });
    console.log("Created property", created.name);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
