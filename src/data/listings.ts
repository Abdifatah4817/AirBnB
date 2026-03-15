import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

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
  host: { name: string; avatar: string; verified: boolean; superhost: boolean; joined: string };
  type: "entire" | "private" | "shared";
  lat: number;
  lng: number;
  reviewsList: Review[];
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
    price: 2500,
    rating: 4.92,
    reviews: 128,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Pool", "Parking", "Security", "Gym", "Balcony"],
    images: [listing1, listing2, listing3],
    host: { name: "Abdifatah", avatar: "", verified: true, superhost: true, joined: "January 2022" },
    type: "entire",
    lat: -1.2635,
    lng: 36.8023,
    reviewsList: [
      { id: "r1", author: "Emma S.", avatar: "", rating: 5, date: "March 2025", comment: "Abdifatah was an amazing host — the apartment was spotless and better than any hotel in Nairobi!" },
      { id: "r2", author: "Michael R.", avatar: "", rating: 5, date: "February 2025", comment: "Abdifatah responded instantly to every message. The views from the balcony are incredible." },
      { id: "r3", author: "Fatima A.", avatar: "", rating: 5, date: "January 2025", comment: "Shoutout to Abdifatah for the warm welcome. Highly recommend this place!" },
    ],
  },
  {
    id: "karen-garden-villa",
    title: "Stunning Villa with Garden in Karen",
    description: "A beautiful colonial-modern villa surrounded by lush tropical gardens. Perfect for families seeking tranquility with easy access to Karen's restaurants and the Giraffe Centre.",
    neighborhood: "Karen",
    price: 3800,
    rating: 4.97,
    reviews: 86,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["WiFi", "Pool", "Parking", "Security", "Garden", "BBQ"],
    images: [listing2, listing3, listing4],
    host: { name: "Abdifatah", avatar: "", verified: true, superhost: true, joined: "January 2022" },
    type: "entire",
    lat: -1.3186,
    lng: 36.7111,
    reviewsList: [
      { id: "r4", author: "David K.", avatar: "", rating: 5, date: "March 2025", comment: "Abdifatah's villa in Karen is absolutely breathtaking. The garden is a paradise." },
      { id: "r5", author: "Sarah O.", avatar: "", rating: 5, date: "February 2025", comment: "Perfect family getaway. Abdifatah made sure everything was ready before we arrived." },
    ],
  },
  {
    id: "kilimani-penthouse",
    title: "Rooftop Penthouse with City Views",
    description: "Wake up above the city in this spectacular penthouse. Features a private rooftop terrace with panoramic views, modern furnishings, and premium amenities.",
    neighborhood: "Kilimani",
    price: 3200,
    rating: 4.89,
    reviews: 64,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Parking", "Security", "Rooftop", "City View"],
    images: [listing3, listing1, listing5],
    host: { name: "Abdifatah", avatar: "", verified: true, superhost: false, joined: "January 2022" },
    type: "entire",
    lat: -1.2886,
    lng: 36.7857,
    reviewsList: [
      { id: "r6", author: "Grace M.", avatar: "", rating: 5, date: "March 2025", comment: "The rooftop views are unforgettable. Abdifatah was super helpful throughout our stay." },
      { id: "r7", author: "James T.", avatar: "", rating: 4, date: "January 2025", comment: "Great location and beautiful penthouse. Would definitely book again through Abdifatah." },
    ],
  },
  {
    id: "kilimani-cozy-studio",
    title: "Cozy Modern Studio in Kilimani",
    description: "A warm and inviting studio apartment with natural wood accents and a spectacular city view. Perfect for solo travelers or couples exploring Nairobi.",
    neighborhood: "Kilimani",
    price: 1500,
    rating: 4.85,
    reviews: 201,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "City View", "Workspace"],
    images: [listing4, listing2, listing6],
    host: { name: "Abdifatah", avatar: "", verified: true, superhost: true, joined: "January 2022" },
    type: "entire",
    lat: -1.2905,
    lng: 36.7820,
    reviewsList: [
      { id: "r8", author: "Peter N.", avatar: "", rating: 5, date: "March 2025", comment: "Best value in Nairobi! Abdifatah's studio is cozy, clean, and perfectly located." },
      { id: "r9", author: "Amina W.", avatar: "", rating: 5, date: "February 2025", comment: "Abdifatah was incredibly responsive. The workspace setup was perfect for my work trip." },
    ],
  },
  {
    id: "lavington-furnished-apartment",
    title: "Elegant Furnished Apartment in Lavington",
    description: "A spacious, elegantly furnished apartment in the heart of Lavington. Open-plan living, modern kitchen, and a quiet neighborhood perfect for longer stays.",
    neighborhood: "Lavington",
    price: 2800,
    rating: 4.91,
    reviews: 112,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Parking", "Security", "Gym", "Workspace", "Laundry"],
    images: [listing5, listing1, listing3],
    host: { name: "Abdifatah", avatar: "", verified: true, superhost: false, joined: "January 2022" },
    type: "entire",
    lat: -1.2780,
    lng: 36.7695,
    reviewsList: [
      { id: "r10", author: "Lucy W.", avatar: "", rating: 5, date: "March 2025", comment: "Abdifatah's Lavington apartment is a hidden gem. Quiet, spacious, and beautifully furnished." },
    ],
  },
  {
    id: "cbd-panoramic-apartment",
    title: "High-Rise Apartment with Panoramic Views",
    description: "Located in the heart of Nairobi CBD, this modern apartment offers stunning panoramic views of the city. Walk to everything — restaurants, shops, and cultural attractions.",
    neighborhood: "Nairobi CBD",
    price: 1800,
    rating: 4.78,
    reviews: 89,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "City View", "Elevator", "24h Reception"],
    images: [listing6, listing4, listing2],
    host: { name: "Abdifatah", avatar: "", verified: false, superhost: false, joined: "January 2022" },
    type: "entire",
    lat: -1.2864,
    lng: 36.8172,
    reviewsList: [
      { id: "r11", author: "Tom B.", avatar: "", rating: 5, date: "February 2025", comment: "Perfect location in the CBD. Abdifatah made check-in super easy." },
      { id: "r12", author: "Zara K.", avatar: "", rating: 4, date: "January 2025", comment: "Great views and very affordable. Abdifatah was always available when needed." },
    ],
  },
];
