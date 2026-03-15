import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

export interface Listing {
  id: string;
  title: string;
  description: string;
  neighborhood: string;
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  host: {
    name: string;
    avatar: string;
    verified: boolean;
    superhost: boolean;
  };
  type: "entire" | "private" | "shared";
  lat: number;
  lng: number;
}

export const neighborhoods = [
  { name: "Westlands", count: 120, description: "Nairobi's modern hub" },
  { name: "Kilimani", count: 95, description: "Trendy & residential" },
  { name: "Karen", count: 68, description: "Leafy & luxurious" },
  { name: "Lavington", count: 82, description: "Quiet & upscale" },
  { name: "Nairobi CBD", count: 54, description: "Heart of the city" },
];

export const listings: Listing[] = [
  {
    id: "westlands-modern-apartment",
    title: "Modern Luxury Apartment in Westlands",
    description: "Experience Nairobi from this stunning modern apartment with floor-to-ceiling windows overlooking the city skyline. Walking distance to Sarit Centre and vibrant nightlife.",
    neighborhood: "Westlands",
    price: 12500,
    rating: 4.92,
    reviews: 128,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Pool", "Parking", "Security", "Gym", "Balcony"],
    images: [listing1],
    host: { name: "Amina W.", avatar: "", verified: true, superhost: true },
    type: "entire",
    lat: -1.2635,
    lng: 36.8023,
  },
  {
    id: "karen-garden-villa",
    title: "Stunning Villa with Garden in Karen",
    description: "A beautiful colonial-modern villa surrounded by lush tropical gardens. Perfect for families seeking tranquility with easy access to Karen's restaurants and the Giraffe Centre.",
    neighborhood: "Karen",
    price: 22000,
    rating: 4.97,
    reviews: 86,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["WiFi", "Pool", "Parking", "Security", "Garden", "BBQ"],
    images: [listing2],
    host: { name: "David K.", avatar: "", verified: true, superhost: true },
    type: "entire",
    lat: -1.3186,
    lng: 36.7111,
  },
  {
    id: "kilimani-penthouse",
    title: "Rooftop Penthouse with City Views",
    description: "Wake up above the city in this spectacular penthouse. Features a private rooftop terrace with panoramic views, modern furnishings, and premium amenities.",
    neighborhood: "Kilimani",
    price: 18500,
    rating: 4.89,
    reviews: 64,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Parking", "Security", "Rooftop", "City View"],
    images: [listing3],
    host: { name: "Grace M.", avatar: "", verified: true, superhost: false },
    type: "entire",
    lat: -1.2886,
    lng: 36.7857,
  },
  {
    id: "kilimani-cozy-studio",
    title: "Cozy Modern Studio in Kilimani",
    description: "A warm and inviting studio apartment with natural wood accents and a spectacular city view. Perfect for solo travelers or couples exploring Nairobi.",
    neighborhood: "Kilimani",
    price: 6800,
    rating: 4.85,
    reviews: 201,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "City View", "Workspace"],
    images: [listing4],
    host: { name: "Peter N.", avatar: "", verified: true, superhost: true },
    type: "entire",
    lat: -1.2905,
    lng: 36.7820,
  },
  {
    id: "lavington-furnished-apartment",
    title: "Elegant Furnished Apartment in Lavington",
    description: "A spacious, elegantly furnished apartment in the heart of Lavington. Open-plan living, modern kitchen, and a quiet neighborhood perfect for longer stays.",
    neighborhood: "Lavington",
    price: 14000,
    rating: 4.91,
    reviews: 112,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Parking", "Security", "Gym", "Workspace", "Laundry"],
    images: [listing5],
    host: { name: "Sarah O.", avatar: "", verified: true, superhost: false },
    type: "entire",
    lat: -1.2780,
    lng: 36.7695,
  },
  {
    id: "cbd-panoramic-apartment",
    title: "High-Rise Apartment with Panoramic Views",
    description: "Located in the heart of Nairobi CBD, this modern apartment offers stunning panoramic views of the city. Walk to everything — restaurants, shops, and cultural attractions.",
    neighborhood: "Nairobi CBD",
    price: 8500,
    rating: 4.78,
    reviews: 89,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "City View", "Elevator", "24h Reception"],
    images: [listing6],
    host: { name: "James T.", avatar: "", verified: false, superhost: false },
    type: "entire",
    lat: -1.2864,
    lng: 36.8172,
  },
];
