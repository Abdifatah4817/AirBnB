import { verifyToken, extractToken, type JWTPayload } from "./jwt";
import { unauthorized } from "./apiResponse";

export async function requireAuth(request: Request): Promise<JWTPayload | Response> {
  const token = extractToken(request.headers.get("Authorization") ?? undefined);
  if (!token) return unauthorized("No token provided");
  const payload = verifyToken(token);
  if (!payload) return unauthorized("Invalid or expired token");
  return payload;
}

export async function requireHost(request: Request): Promise<JWTPayload | Response> {
  const result = await requireAuth(request);
  if (result instanceof Response) return result;
  if (result.role !== "host" && result.role !== "admin") {
    return unauthorized("Only hosts can perform this action");
  }
  return result;
}

export function isAuthError(val: JWTPayload | Response): val is Response {
  return val instanceof Response;
}
