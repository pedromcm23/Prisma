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
];
