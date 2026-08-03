export type Review = { text: string; author: string; rating: number };
export type RoomType = {
  name: string;
  price: number;
  amenities: string[];
  photos: string[]; // data URLs
};

export type PropertyData = {
  name: string;
  location: string;
  tagline: string;
  rooms: RoomType[];
  basePrice: number;
  specials: string[];
  directions: string[];
  reviews: Review[];
  hostName: string;
  hostInterests: string;
  hostLoves: string;
  importUrl: string;
  lat?: number;
  lng?: number;
};

export const emptyData = (): PropertyData => ({
  name: "",
  location: "",
  tagline: "",
  rooms: [
    { name: "Garden Room", price: 120, amenities: ["Wi-Fi", "Terrace"], photos: [] },
    { name: "Sea View Suite", price: 210, amenities: ["Wi-Fi", "Sea view", "Balcony"], photos: [] },
  ],
  basePrice: 120,
  specials: ["", "", ""],
  directions: [
    "Hop off at Central Station",
    "Follow the smell of fresh bakery",
    "Look for the blue Azulejo tile door",
  ],
  reviews: [
    { text: "", author: "", rating: 5 },
    { text: "", author: "", rating: 5 },
    { text: "", author: "", rating: 5 },
  ],
  hostName: "",
  hostInterests: "",
  hostLoves: "",
  importUrl: "",
});

export type SpontaneousStay = Listing & {
  hoursLeft: number;
  originalPrice: number;
  dealPrice: number;
  perks: string[];
  window: string;
};

const EXTRAS = [
  ["Free late checkout (2pm)", "Welcome drinks on the terrace"],
  ["Complimentary breakfast basket", "Free bike rental for a day"],
  ["Sunset aperitivo on arrival", "Free late checkout (2pm)"],
  ["Handmade welcome sweets", "Guided neighborhood walk"],
];

export function getSpontaneousStays(listings: Listing[] = SAMPLE_LISTINGS): SpontaneousStay[] {
  return listings.slice(0, 4).map((l, i) => {
    const discount = 0.2 + i * 0.05;
    const dealPrice = Math.round(l.price * (1 - discount));
    const hoursLeft = [14, 28, 46, 68][i];
    return {
      ...l,
      originalPrice: l.price,
      dealPrice,
      hoursLeft,
      perks: EXTRAS[i % EXTRAS.length],
      window: hoursLeft < 24 ? "Tonight" : hoursLeft < 48 ? "Tomorrow" : "This weekend",
    };
  });
}

export type Listing = {
  slug: string;
  name: string;
  location: string;
  neighborhood: string;
  tagline: string;
  price: number;
  rating: number;
  hostName: string;
  tags: string[];
  color: string; // tailwind bg gradient key
  image?: string | null;
  lat: number; // 0-100 % on map
  lng: number; // 0-100 % on map
};

export const SAMPLE_LISTINGS: Listing[] = [
  {
    slug: "casa-amarela",
    name: "Casa Amarela",
    location: "Alfama, Lisbon",
    neighborhood: "Alfama",
    tagline: "A sunlit hideaway on the old cobbled hill",
    price: 148,
    rating: 4.9,
    hostName: "Ana",
    tags: ["Terrace", "Breakfast", "Cats"],
    color: "from-primary to-mustard",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    lat: 42,
    lng: 28,
  },
  {
    slug: "olive-hill",
    name: "Olive Hill Retreat",
    location: "Chania, Crete",
    neighborhood: "Old Town",
    tagline: "Sleep under fig trees, wake up to the sea",
    price: 210,
    rating: 4.8,
    hostName: "Yannis",
    tags: ["Sea view", "Pool", "Bikes"],
    color: "from-accent to-ocean",
    image: "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=1200&auto=format&fit=crop",
    lat: 58,
    lng: 62,
  },
  {
    slug: "casita-limon",
    name: "Casita Limón",
    location: "Cadaqués, Spain",
    neighborhood: "Portlligat",
    tagline: "Whitewashed walls, lemon trees, endless siestas",
    price: 175,
    rating: 5.0,
    hostName: "Marta",
    tags: ["Garden", "Sunset", "Art"],
    color: "from-mustard to-primary",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
    lat: 30,
    lng: 45,
  },
  {
    slug: "riad-nour",
    name: "Riad Nour",
    location: "Marrakech, Morocco",
    neighborhood: "Medina",
    tagline: "A tiled courtyard oasis inside the buzzing medina",
    price: 132,
    rating: 4.7,
    hostName: "Karim",
    tags: ["Courtyard", "Hammam", "Rooftop"],
    color: "from-primary to-accent",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop",
    lat: 70,
    lng: 20,
  },
  {
    slug: "villa-fiore",
    name: "Villa Fiore",
    location: "Ostuni, Puglia",
    neighborhood: "Città Bianca",
    tagline: "A trullo dream under Puglian starlight",
    price: 195,
    rating: 4.9,
    hostName: "Giulia",
    tags: ["Trullo", "Garden", "Wine"],
    color: "from-mustard to-accent",
    lat: 50,
    lng: 78,
  },
  {
    slug: "atelier-bleu",
    name: "Atelier Bleu",
    location: "Essaouira, Morocco",
    neighborhood: "Medina",
    tagline: "An artist's blue-shuttered hideaway by the Atlantic",
    price: 118,
    rating: 4.8,
    hostName: "Leila",
    tags: ["Ocean", "Art", "Terrace"],
    color: "from-accent to-primary",
    lat: 78,
    lng: 50,
  },
  {
    slug: "riad-yasmine",
    name: "Riad Yasmine",
    location: "Marrakech, Morocco",
    neighborhood: "Medina",
    tagline: "A green tiled oasis hidden away in the Medina.",
    price: 180,
    rating: 4.9,
    hostName: "Yasmine",
    tags: ["POOL", "MEDINA", "BREAKFAST"],
    color: "from-primary to-mustard",
    image: "https://images.unsplash.com/photo-1542314831-c6a4d1429d6d?q=80&w=1200&auto=format&fit=crop",
    lat: 71,
    lng: 22,
  },
  {
    slug: "masseria-moroseta",
    name: "Masseria Moroseta",
    location: "Ostuni, Italy",
    neighborhood: "Puglia",
    tagline: "Modern minimalism wrapped in ancient olive groves.",
    price: 250,
    rating: 5.0,
    hostName: "Carlo",
    tags: ["POOL", "FARM", "PUGLIA"],
    color: "from-mustard to-primary",
    image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200&auto=format&fit=crop",
    lat: 48,
    lng: 76,
  },
  {
    slug: "the-slow",
    name: "The Slow",
    location: "Canggu, Bali",
    neighborhood: "Batu Bolong",
    tagline: "Tropical brutalism and laid-back island living.",
    price: 190,
    rating: 4.8,
    hostName: "George",
    tags: ["SURF", "ART", "TROPICAL"],
    color: "from-accent to-ocean",
    image: "https://images.unsplash.com/photo-1522792851823-3812f0afaf86?q=80&w=1200&auto=format&fit=crop",
    lat: 80,
    lng: 90,
  },
  {
    slug: "casa-cosmos",
    name: "Casa Cosmos",
    location: "Puerto Escondido, Mexico",
    neighborhood: "Oaxaca",
    tagline: "A brutalist concrete pavilion on a wild beach.",
    price: 320,
    rating: 4.9,
    hostName: "Elena",
    tags: ["BEACHFRONT", "NATURE", "ISOLATION"],
    color: "from-primary to-accent",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop",
    lat: 60,
    lng: 10,
  }
];
