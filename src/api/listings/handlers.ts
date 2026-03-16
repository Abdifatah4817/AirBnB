import prisma from "@/lib/prisma";
import { listingSchema } from "@/lib/validations";
import { ok, created, badRequest, forbidden, notFound, serverError } from "@/lib/apiResponse";
import { requireAuth, requireHost, isAuthError } from "@/lib/middleware";

// GET /api/listings  — public, supports ?neighborhood=&minPrice=&maxPrice=&guests=&sort=
export async function getListings(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const neighborhood = url.searchParams.get("neighborhood") || undefined;
    const minPrice = Number(url.searchParams.get("minPrice")) || undefined;
    const maxPrice = Number(url.searchParams.get("maxPrice")) || undefined;
    const guests = Number(url.searchParams.get("guests")) || undefined;
    const sort = url.searchParams.get("sort") || "createdAt";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(50, Number(url.searchParams.get("limit")) || 12);

    const where = {
      isActive: true,
      ...(neighborhood && { neighborhood }),
      ...(minPrice && { pricePerNight: { gte: minPrice } }),
      ...(maxPrice && { pricePerNight: { ...(minPrice ? { gte: minPrice } : {}), lte: maxPrice } }),
      ...(guests && { maxGuests: { gte: guests } }),
    };

    const orderBy =
      sort === "price_asc" ? { pricePerNight: "asc" as const } :
      sort === "price_desc" ? { pricePerNight: "desc" as const } :
      { createdAt: "desc" as const };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          host: { select: { id: true, name: true, image: true } },
          _count: { select: { reviews: true, bookings: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return ok({ listings, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error("[getListings]", e);
    return serverError();
  }
}

// GET /api/listings/:id — public
export async function getListing(request: Request, id: string): Promise<Response> {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, name: true, image: true, createdAt: true } },
        reviews: {
          include: { author: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });
    if (!listing || !listing.isActive) return notFound("Listing not found");
    return ok(listing);
  } catch (e) {
    console.error("[getListing]", e);
    return serverError();
  }
}

// POST /api/listings — host only
export async function createListing(request: Request): Promise<Response> {
  try {
    const auth = await requireHost(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const parsed = listingSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const listing = await prisma.listing.create({
      data: { ...parsed.data, hostId: auth.userId },
      include: { host: { select: { id: true, name: true, image: true } } },
    });
    return created(listing);
  } catch (e) {
    console.error("[createListing]", e);
    return serverError();
  }
}

// PATCH /api/listings/:id — host only, must own listing
export async function updateListing(request: Request, id: string): Promise<Response> {
  try {
    const auth = await requireHost(request);
    if (isAuthError(auth)) return auth;

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return notFound("Listing not found");
    if (existing.hostId !== auth.userId) return forbidden("You do not own this listing");

    const body = await request.json();
    const parsed = listingSchema.partial().safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: parsed.data,
      include: { host: { select: { id: true, name: true, image: true } } },
    });
    return ok(updated);
  } catch (e) {
    console.error("[updateListing]", e);
    return serverError();
  }
}

// DELETE /api/listings/:id — host only, must own listing
export async function deleteListing(request: Request, id: string): Promise<Response> {
  try {
    const auth = await requireHost(request);
    if (isAuthError(auth)) return auth;

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) return notFound("Listing not found");
    if (existing.hostId !== auth.userId) return forbidden("You do not own this listing");

    // Soft delete — keeps booking history intact
    await prisma.listing.update({ where: { id }, data: { isActive: false } });
    return ok({ message: "Listing deleted successfully" });
  } catch (e) {
    console.error("[deleteListing]", e);
    return serverError();
  }
}

// GET /api/listings/host/:hostId — get all listings by a host
export async function getHostListings(request: Request, hostId: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;
    if (auth.userId !== hostId) return forbidden("Cannot view another host's listings");

    const listings = await prisma.listing.findMany({
      where: { hostId },
      include: {
        _count: { select: { bookings: true, reviews: true } },
        bookings: {
          where: { status: { in: ["pending", "confirmed"] } },
          select: { id: true, checkIn: true, checkOut: true, status: true, totalPrice: true,
            guest: { select: { id: true, name: true, email: true } } },
          orderBy: { checkIn: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return ok(listings);
  } catch (e) {
    console.error("[getHostListings]", e);
    return serverError();
  }
}
