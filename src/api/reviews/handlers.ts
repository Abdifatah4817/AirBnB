import prisma from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";
import { ok, created, badRequest, forbidden, notFound, serverError } from "@/lib/apiResponse";
import { requireAuth, isAuthError } from "@/lib/middleware";

// POST /api/reviews
export async function createReview(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { bookingId, rating, comment } = parsed.data;

    // Verify booking belongs to this guest and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });
    if (!booking) return notFound("Booking not found");
    if (booking.guestId !== auth.userId) return forbidden("You can only review your own bookings");
    if (booking.status !== "completed") return badRequest("You can only review completed stays");
    if (booking.review) return badRequest("You have already reviewed this booking");

    const review = await prisma.review.create({
      data: { bookingId, listingId: booking.listingId, authorId: auth.userId, rating, comment },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    // Update listing average rating
    const stats = await prisma.review.aggregate({
      where: { listingId: booking.listingId },
      _avg: { rating: true },
    });
    await prisma.listing.update({
      where: { id: booking.listingId },
      data: { rating: stats._avg.rating ?? rating },
    });

    return created(review);
  } catch (e) {
    console.error("[createReview]", e);
    return serverError();
  }
}

// GET /api/listings/:listingId/reviews
export async function getListingReviews(request: Request, listingId: string): Promise<Response> {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return notFound("Listing not found");

    const reviews = await prisma.review.findMany({
      where: { listingId },
      include: { author: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    const stats = await prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return ok({
      reviews,
      averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
      totalReviews: stats._count.rating,
    });
  } catch (e) {
    console.error("[getListingReviews]", e);
    return serverError();
  }
}

// DELETE /api/reviews/:id — author only
export async function deleteReview(request: Request, id: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return notFound("Review not found");
    if (review.authorId !== auth.userId) return forbidden("You can only delete your own reviews");

    await prisma.review.delete({ where: { id } });
    return ok({ message: "Review deleted" });
  } catch (e) {
    console.error("[deleteReview]", e);
    return serverError();
  }
}
