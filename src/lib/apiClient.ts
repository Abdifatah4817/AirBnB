const BASE_URL = import.meta.env.VITE_API_URL || "";

function getToken(): string | null {
  try { return JSON.parse(localStorage.getItem("nairobistay_token") || "null"); }
  catch { return null; }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; success: boolean }> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json = await res.json();
  return json;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: "guest" | "host" }) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ user: User; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: () => request<User>("/api/auth/me"),
};

// ─── Listings ─────────────────────────────────────────────────────────────────
export const listingsApi = {
  getAll: (params?: Record<string, string | number>) => {
    const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
    return request<{ listings: Listing[]; total: number; page: number; pages: number }>(`/api/listings${qs}`);
  },

  getOne: (id: string) => request<Listing>(`/api/listings/${id}`),

  create: (data: Partial<Listing>) =>
    request<Listing>("/api/listings", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Listing>) =>
    request<Listing>(`/api/listings/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  delete: (id: string) =>
    request(`/api/listings/${id}`, { method: "DELETE" }),

  getHostListings: (hostId: string) =>
    request<Listing[]>(`/api/listings/host/${hostId}`),

  checkAvailability: (listingId: string, checkIn: string, checkOut: string) =>
    request<{ available: boolean }>(`/api/listings/${listingId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: { listingId: string; checkIn: string; checkOut: string; guestsCount: number; specialReqs?: string }) =>
    request<Booking>("/api/bookings", { method: "POST", body: JSON.stringify(data) }),

  getOne: (id: string) => request<Booking>(`/api/bookings/${id}`),

  cancel: (id: string) =>
    request<Booking>(`/api/bookings/${id}/cancel`, { method: "PATCH" }),

  confirm: (id: string) =>
    request<Booking>(`/api/bookings/${id}/confirm`, { method: "PATCH" }),

  getUserBookings: (userId: string) =>
    request<Booking[]>(`/api/users/${userId}/bookings`),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsApi = {
  create: (data: { bookingId: string; rating: number; comment: string }) =>
    request<Review>("/api/reviews", { method: "POST", body: JSON.stringify(data) }),

  getForListing: (listingId: string) =>
    request<{ reviews: Review[]; averageRating: number; totalReviews: number }>(`/api/listings/${listingId}/reviews`),

  delete: (id: string) =>
    request(`/api/reviews/${id}`, { method: "DELETE" }),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  getOne: (id: string) => request<User>(`/api/users/${id}`),

  update: (id: string, data: Partial<User & { currentPassword?: string; newPassword?: string }>) =>
    request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "guest" | "host" | "admin";
  image?: string;
  phone?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  neighborhood: string;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  type: string;
  rating?: number;
  isActive: boolean;
  hostId: string;
  host?: User;
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialReqs?: string;
  listing?: Listing;
  guest?: User;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  listingId: string;
  authorId: string;
  rating: number;
  comment: string;
  author?: User;
  createdAt: string;
}
