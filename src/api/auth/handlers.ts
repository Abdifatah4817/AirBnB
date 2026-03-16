import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { registerSchema, loginSchema } from "@/lib/validations";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/apiResponse";
import { requireAuth, isAuthError } from "@/lib/middleware";

// POST /api/auth/register
export async function register(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { name, email, password, role, phone } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, hashedPassword, role, phone },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return created({ user, token });
  } catch (e) {
    console.error("[register]", e);
    return serverError();
  }
}

// POST /api/auth/login
export async function login(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.hashedPassword) return unauthorized("Invalid email or password");

    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) return unauthorized("Invalid email or password");

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return ok({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
      token,
    });
  } catch (e) {
    console.error("[login]", e);
    return serverError();
  }
}

// GET /api/auth/me
export async function me(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, name: true, email: true, role: true, phone: true, image: true, createdAt: true },
    });
    if (!user) return unauthorized("User not found");
    return ok(user);
  } catch (e) {
    console.error("[me]", e);
    return serverError();
  }
}
