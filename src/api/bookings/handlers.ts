import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { ok, created, badRequest, forbidden, notFound, serverError } from "@/lib/apiResponse";
import { requireAuth, isAuthError } from "@/lib/middleware";

// POST /api/bookings
export async function createBooking(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { listingId, checkIn, checkOut, guestsCount, specialReqs } = parsed.data;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Verify listing exists
    const listing = await prisma.listing.findUnique({ where: { id: listingId, isActive: true } });
    if (!listing) return notFound("Listing not found");

    // Prevent host booking their own listing
    if (listing.hostId === auth.userId) return badRequest("You cannot book your own listing");

    // Validate guest count
    if (guestsCount > listing.maxGuests) {
      return badRequest(`This listing allows a maximum of ${listing.maxGuests} guests`);
    }

    // Check for double booking — no overlapping confirmed/pending bookings
    const conflict = await prisma.booking.findFirst({
      where: {
        listingId,
        status: { in: ["pending", "confirmed"] },
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
        ],
      },
    });
    if (conflict) return badRequest("These dates are not available. Please choose different dates.");

    // Calculate total price
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
    const subtotal = listing.pricePerNight * nights;
    const serviceFee = Math.round(subtotal * 0.12);
    const totalPrice = subtotal + serviceFee;

    const booking = await prisma.booking.create({
      data: { listingId, guestId: auth.userId, checkIn: checkInDate, checkOut: checkOutDate,
        guestsCount, totalPrice, specialReqs },
      include: {
        listing: { select: { id: true, title: true, images: true, neighborhood: true } },
        guest: { select: { id: true, name: true, email: true } },
      },
    });
    return created(booking);
  } catch (e) {
    console.error("[createBooking]", e);
    return serverError();
  }
}

// GET /api/bookings/:id
export async function getBooking(request: Request, id: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        listing: { include: { host: { select: { id: true, name: true, image: true, phone: true } } } },
        guest: { select: { id: true, name: true, email: true, phone: true } },
        review: true,
        payment: true,
      },
    });
    if (!booking) return notFound("Booking not found");

    // Only guest or host can view
    const isGuest = booking.guestId === auth.userId;
    const isHost = booking.listing.hostId === auth.userId;
    if (!isGuest && !isHost) return forbidden("Access denied");

    return ok(booking);
  } catch (e) {
    console.error("[getBooking]", e);
    return serverError();
  }
}

// PATCH /api/bookings/:id/cancel
export async function cancelBooking(request: Request, id: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { listing: { select: { hostId: true } } },
    });
    if (!booking) return notFound("Booking not found");

    const isGuest = booking.guestId === auth.userId;
    const isHost = booking.listing.hostId === auth.userId;
    if (!isGuest && !isHost) return forbidden("Access denied");

    if (booking.status === "cancelled") return badRequest("Booking is already cancelled");
    if (booking.status === "completed") return badRequest("Cannot cancel a completed booking");

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return ok(updated);
  } catch (e) {
    console.error("[cancelBooking]", e);
    return serverError();
  }
}

// PATCH /api/bookings/:id/confirm — host only
export async function confirmBooking(request: Request, id: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { listing: { select: { hostId: true } } },
    });
    if (!booking) return notFound("Booking not found");
    if (booking.listing.hostId !== auth.userId) return forbidden("Only the host can confirm bookings");
    if (booking.status !== "pending") return badRequest("Only pending bookings can be confirmed");

    const updated = await prisma.booking.update({ where: { id }, data: { status: "confirmed" } });
    return ok(updated);
  } catch (e) {
    console.error("[confirmBooking]", e);
    return serverError();
  }
}

// GET /api/listings/:listingId/availability?checkIn=&checkOut=
export async function checkAvailability(request: Request, listingId: string): Promise<Response> {
  try {
    const url = new URL(request.url);
    const checkIn = url.searchParams.get("checkIn");
    const checkOut = url.searchParams.get("checkOut");
    if (!checkIn || !checkOut) return badRequest("checkIn and checkOut are required");

    const conflict = await prisma.booking.findFirst({
      where: {
        listingId,
        status: { in: ["pending", "confirmed"] },
        OR: [{ checkIn: { lt: new Date(checkOut) }, checkOut: { gt: new Date(checkIn) } }],
      },
    });
    return ok({ available: !conflict });
  } catch (e) {
    console.error("[checkAvailability]", e);
    return serverError();
  }
}
