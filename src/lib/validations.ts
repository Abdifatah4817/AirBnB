import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["guest", "host"]).default("guest"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  pricePerNight: z.number().int().positive("Price must be a positive number"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().int().min(1),
  maxGuests: z.number().int().min(1),
  amenities: z.array(z.string()).default([]),
  type: z.enum(["entire", "private", "shared"]).default("entire"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const bookingSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  checkIn: z.string().datetime("Invalid check-in date"),
  checkOut: z.string().datetime("Invalid check-out date"),
  guestsCount: z.number().int().min(1),
  specialReqs: z.string().optional(),
}).refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export const reviewSchema = z.object({
  bookingId: z.string().cuid("Invalid booking ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
