import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per window

// Simple in-memory rate limiter (Note: This resets on server restart/redeploy and is per-instance)
// For production, use Redis (e.g., Upstash)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export async function middleware(request: NextRequest) {
  // Rate Limiting Logic
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // Clean up old entries periodically or on access (lazy cleanup)
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - entry.lastReset > RATE_LIMIT_WINDOW) {
    entry.count = 0;
    entry.lastReset = now;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);

  if (entry.count > MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
