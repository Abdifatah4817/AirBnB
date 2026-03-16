import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, badRequest, notFound, forbidden, serverError } from "@/lib/apiResponse";
import { requireAuth, isAuthError } from "@/lib/middleware";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

// GET /api/users/:id
export async function getUser(request: Request, userId: string): Promise<Response> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true,
        image: true, phone: true, createdAt: true,
        listings: {
          where: { isActive: true },
          select: { id: true, title: true, pricePerNight: true, neighborhood: true, images: true, rating: true },
        },
        _count: { select: { listings: true, reviews: true } },
      },
    });
    if (!user) return notFound("User not found");
    return ok(user);
  } catch (e) {
    console.error("[getUser]", e);
    return serverError();
  }
}

// PATCH /api/users/:id
export async function updateUser(request: Request, userId: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;
    if (auth.userId !== userId) return forbidden("Cannot update another user's profile");

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { name, phone, image, currentPassword, newPassword } = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (image) updateData.image = image;

    if (newPassword) {
      if (!currentPassword) return badRequest("Current password required to set new password");
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.hashedPassword) return badRequest("No password set on this account");
      const valid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!valid) return badRequest("Current password is incorrect");
      updateData.hashedPassword = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, phone: true, image: true },
    });
    return ok(updated);
  } catch (e) {
    console.error("[updateUser]", e);
    return serverError();
  }
}

// GET /api/users/:id/bookings
export async function getUserBookings(request: Request, userId: string): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;
    if (auth.userId !== userId) return forbidden("Cannot view another user's bookings");

    const bookings = await prisma.booking.findMany({
      where: { guestId: userId },
      include: {
        listing: { select: { id: true, title: true, images: true, neighborhood: true, pricePerNight: true } },
        review: { select: { id: true, rating: true, comment: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return ok(bookings);
  } catch (e) {
    console.error("[getUserBookings]", e);
    return serverError();
  }
}
