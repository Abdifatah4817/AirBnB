export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data } satisfies ApiResponse<T>, { status });
}

export function created<T>(data: T): Response {
  return Response.json({ success: true, data } satisfies ApiResponse<T>, { status: 201 });
}

export function badRequest(error: string, errors?: Record<string, string[]>): Response {
  return Response.json({ success: false, error, errors } satisfies ApiResponse, { status: 400 });
}

export function unauthorized(error = "Unauthorized"): Response {
  return Response.json({ success: false, error } satisfies ApiResponse, { status: 401 });
}

export function forbidden(error = "Forbidden"): Response {
  return Response.json({ success: false, error } satisfies ApiResponse, { status: 403 });
}

export function notFound(error = "Not found"): Response {
  return Response.json({ success: false, error } satisfies ApiResponse, { status: 404 });
}

export function serverError(error = "Internal server error"): Response {
  return Response.json({ success: false, error } satisfies ApiResponse, { status: 500 });
}
