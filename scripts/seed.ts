import { prisma } from "../lib/prisma";

const PHOTOS = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89404bb2a0b?w=800&q=80",
  "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80"
];

const PROPS_DATA = [
  {
    name: "Casa Amarela",
    location: "Alfama, Lisbon",
    tagline: "A sunlit hideaway on the old cobbled hill",
    basePrice: 148,
    rooms: [
      { name: "Sunny Balcony Room", price: 148, amenities: ["Wi-Fi", "Balcony", "Coffee Maker"], photos: [PHOTOS[0], PHOTOS[1]] }
    ],
    specials: ["Free fresh pastel de nata every morning", "Guided tour of Alfama", ""],
    directions: ["Hop off at Santa Apolonia", "Walk up the stairs for 5 mins", "Look for the yellow door"],
    hostName: "Pedro (1623)",
    hostInterests: "Architecture, Fado, and surfing.",
    hostLoves: "Waking up early to see the Tagus river.",
    theme: "folk-pop"
  },
  {
    name: "Olive Hill Retreat",
    location: "Chania, Crete",
    tagline: "Sleep under fig trees, wake up to the sea",
    basePrice: 210,
    rooms: [
      { name: "Ocean View Suite", price: 210, amenities: ["Wi-Fi", "Sea view", "Private Pool"], photos: [PHOTOS[2], PHOTOS[3]] }
    ],
    specials: ["Complimentary local wine", "Free bike rental", ""],
    directions: ["Drive 15 mins from Chania Airport", "Follow the signs to Olive Hill", "Park next to the old windmill"],
    hostName: "Pedro (1623)",
    hostInterests: "Cooking, sailing, and hiking.",
    hostLoves: "The peaceful sound of the cicadas in the summer.",
    theme: "brutalist"
  },
  {
    name: "Casita Limón",
    location: "Cadaqués, Spain",
    tagline: "Whitewashed walls, lemon trees, endless siestas",
    basePrice: 175,
    rooms: [
      { name: "Garden Studio", price: 175, amenities: ["Air Conditioning", "Garden Access", "Kitchenette"], photos: [PHOTOS[4], PHOTOS[5]] }
    ],
    specials: ["Welcome basket with local cheeses", "Late checkout at 2pm", ""],
    directions: ["Take the winding road to Portlligat", "Stop at the Salvador Dali museum", "It is the blue door next door"],
    hostName: "Pedro (1723)",
    hostInterests: "Art history, painting, and wine tasting.",
    hostLoves: "Watching the sunset over the Mediterranean.",
    theme: "mediterranean"
  },
  {
    name: "Riad Nour",
    location: "Marrakech, Morocco",
    tagline: "A tiled courtyard oasis inside the buzzing medina",
    basePrice: 132,
    rooms: [
      { name: "Courtyard Room", price: 132, amenities: ["Wi-Fi", "Hammam access", "Breakfast included"], photos: [PHOTOS[1], PHOTOS[2]] }
    ],
    specials: ["Traditional Moroccan breakfast", "Mint tea on arrival", ""],
    directions: ["Enter via Bab Doukkala", "Follow the main alley", "Turn left at the spice market"],
    hostName: "Pedro (1723)",
    hostInterests: "Photography, local crafts, and tea.",
    hostLoves: "The vibrant colors of the souks.",
    theme: "folk-pop"
  }
];

async function main() {
  console.log("Starting DB seed...");

  const user1 = await prisma.user.upsert({
    where: { email: "pedromcm1623@gmail.com" },
    update: { role: "HOST", name: "Pedro (1623)" },
    create: { email: "pedromcm1623@gmail.com", role: "HOST", name: "Pedro (1623)" },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "pedromcm1723@gmail.com" },
    update: { role: "HOST", name: "Pedro (1723)" },
    create: { email: "pedromcm1723@gmail.com", role: "HOST", name: "Pedro (1723)" },
  });

  const guest = await prisma.user.upsert({
    where: { email: "pedromcm23@gmail.com" },
    update: { role: "CUSTOMER", name: "Pedro (Guest)", image: "https://github.com/pedromcm23.png" },
    create: { email: "pedromcm23@gmail.com", role: "CUSTOMER", name: "Pedro (Guest)", image: "https://github.com/pedromcm23.png" },
  });

  console.log(`Ensured users exist.`);

  // Clear existing data
  await prisma.guestPerk.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.property.deleteMany({});
  console.log("Deleted old properties, bookings, and perks.");

  for (let i = 0; i < PROPS_DATA.length; i++) {
    const data = PROPS_DATA[i];
    const hostId = i < 2 ? user1.id : user2.id;
    
    const landingPageJson = {
      name: data.name,
      location: data.location,
      tagline: data.tagline,
      rooms: data.rooms,
      basePrice: data.basePrice,
      specials: data.specials,
      directions: data.directions,
      reviews: [
        { text: "Absolutely incredible stay! The attention to detail is unmatched.", author: "Sarah T.", rating: 5 },
        { text: "A hidden gem. We will definitely be coming back next year.", author: "Michael B.", rating: 5 },
        { text: "The host was wonderful and the space was impeccably clean.", author: "Emma R.", rating: 5 }
      ],
      hostName: data.hostName,
      hostInterests: data.hostInterests,
      hostLoves: data.hostLoves,
      importUrl: ""
    };

    const brandKitJson = {
      themeId: data.theme,
    };

    const property = await prisma.property.create({
      data: {
        name: data.name,
        description: data.location,
        hostId: hostId,
        landingPageJson,
        brandKitJson
      }
    });

    // Create 3 past bookings (for charts & revenue)
    for (let j = 0; j < 3; j++) {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - (j + 1));
      pastDate.setDate(15); // fixed day
      
      const endDate = new Date(pastDate);
      endDate.setDate(pastDate.getDate() + 3);

      await prisma.booking.create({
        data: {
          propertyId: property.id,
          customerId: guest.id,
          startDate: pastDate,
          endDate: endDate,
          status: "CONFIRMED",
          totalPrice: data.basePrice * 3
        }
      });
    }

    // Create 2 future bookings
    for (let j = 0; j < 2; j++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + (j + 1));
      futureDate.setDate(10);
      
      const endDate = new Date(futureDate);
      endDate.setDate(futureDate.getDate() + 4);

      await prisma.booking.create({
        data: {
          propertyId: property.id,
          customerId: guest.id,
          startDate: futureDate,
          endDate: endDate,
          status: j === 0 ? "CONFIRMED" : "PENDING",
          totalPrice: data.basePrice * 4
        }
      });
    }

    // Create 2 GuestPerks for this host (only if it's the first property to avoid duplication per host)
    if (i === 0 || i === 2) {
      await prisma.guestPerk.create({
        data: {
          hostId: hostId,
          stayName: data.name,
          guestName: "Alice Wanderlust",
          guestEmail: "alice@example.com",
          postUrl: PHOTOS[Math.floor(Math.random() * PHOTOS.length)],
          note: "This place was magic! Tagged you on my reels.",
          status: "pending"
        }
      });
      await prisma.guestPerk.create({
        data: {
          hostId: hostId,
          stayName: data.name,
          guestName: "John Doe",
          guestEmail: "john@example.com",
          postUrl: PHOTOS[Math.floor(Math.random() * PHOTOS.length)],
          note: "Thanks for the amazing hospitality. 🍷",
          status: "approved",
          code: "PRISMA15-JOHND"
        }
      });
    }
  }

  console.log("Successfully seeded properties, bookings, and perks!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
