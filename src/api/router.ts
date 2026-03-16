import { register, login, me } from "./auth/handlers";
import { getUser, updateUser, getUserBookings } from "./users/handlers";
import { getListings, getListing, createListing, updateListing, deleteListing, getHostListings } from "./listings/handlers";
import { createBooking, getBooking, cancelBooking, confirmBooking, checkAvailability } from "./bookings/handlers";
import { createReview, getListingReviews, deleteReview } from "./reviews/handlers";
import { notFound, serverError } from "@/lib/apiResponse";

export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, ""); // strip trailing slash
  const method = request.method.toUpperCase();

  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    if (path === "/api/auth/register" && method === "POST") return register(request);
    if (path === "/api/auth/login"    && method === "POST") return login(request);
    if (path === "/api/auth/me"       && method === "GET")  return me(request);

    // ── Listings ──────────────────────────────────────────────────────────
    if (path === "/api/listings" && method === "GET")  return getListings(request);
    if (path === "/api/listings" && method === "POST") return createListing(request);

    const listingMatch = path.match(/^\/api\/listings\/([^/]+)$/);
    if (listingMatch) {
      const id = listingMatch[1];
      if (method === "GET")    return getListing(request, id);
      if (method === "PATCH")  return updateListing(request, id);
      if (method === "DELETE") return deleteListing(request, id);
    }

    const hostListingsMatch = path.match(/^\/api\/listings\/host\/([^/]+)$/);
    if (hostListingsMatch && method === "GET") return getHostListings(request, hostListingsMatch[1]);

    const availabilityMatch = path.match(/^\/api\/listings\/([^/]+)\/availability$/);
    if (availabilityMatch && method === "GET") return checkAvailability(request, availabilityMatch[1]);

    const listingReviewsMatch = path.match(/^\/api\/listings\/([^/]+)\/reviews$/);
    if (listingReviewsMatch && method === "GET") return getListingReviews(request, listingReviewsMatch[1]);

    // ── Bookings ──────────────────────────────────────────────────────────
    if (path === "/api/bookings" && method === "POST") return createBooking(request);

    const bookingMatch = path.match(/^\/api\/bookings\/([^/]+)$/);
    if (bookingMatch && method === "GET") return getBooking(request, bookingMatch[1]);

    const cancelMatch = path.match(/^\/api\/bookings\/([^/]+)\/cancel$/);
    if (cancelMatch && method === "PATCH") return cancelBooking(request, cancelMatch[1]);

    const confirmMatch = path.match(/^\/api\/bookings\/([^/]+)\/confirm$/);
    if (confirmMatch && method === "PATCH") return confirmBooking(request, confirmMatch[1]);

    // ── Reviews ───────────────────────────────────────────────────────────
    if (path === "/api/reviews" && method === "POST") return createReview(request);

    const reviewMatch = path.match(/^\/api\/reviews\/([^/]+)$/);
    if (reviewMatch && method === "DELETE") return deleteReview(request, reviewMatch[1]);

    // ── Users ─────────────────────────────────────────────────────────────
    const userMatch = path.match(/^\/api\/users\/([^/]+)$/);
    if (userMatch) {
      const id = userMatch[1];
      if (method === "GET")   return getUser(request, id);
      if (method === "PATCH") return updateUser(request, id);
    }

    const userBookingsMatch = path.match(/^\/api\/users\/([^/]+)\/bookings$/);
    if (userBookingsMatch && method === "GET") return getUserBookings(request, userBookingsMatch[1]);

    return notFound("API route not found");
  } catch (e) {
    console.error("[router]", e);
    return serverError();
  }
}
