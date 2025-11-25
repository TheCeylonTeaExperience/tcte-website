import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

const PUBLIC_API_PATH_PREFIXES = ["/api/public/", "/api/booking"];
const PUBLIC_RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute window
const PUBLIC_RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per IP per window

const publicRateLimitStore = new Map();

function isPublicApiPath(pathname) {
  return PUBLIC_API_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function resolveClientIdentifier(request) {
  const forwardedFor =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("X-Forwarded-For") ||
    "";
  const remoteAddress = forwardedFor.split(",")[0]?.trim();
  if (remoteAddress) {
    return remoteAddress;
  }

  const realIp = request.headers.get("x-real-ip") || request.ip;
  return realIp || "anonymous";
}

function applyPublicRateLimit(request) {
  const clientKey = resolveClientIdentifier(request);
  const now = Date.now();

  const existing = publicRateLimitStore.get(clientKey) || {
    count: 0,
    resetAt: now + PUBLIC_RATE_LIMIT_WINDOW_MS,
  };

  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + PUBLIC_RATE_LIMIT_WINDOW_MS;
  }

  existing.count += 1;
  publicRateLimitStore.set(clientKey, existing);

  const remaining = Math.max(
    0,
    PUBLIC_RATE_LIMIT_MAX_REQUESTS - existing.count
  );
  const allowed = existing.count <= PUBLIC_RATE_LIMIT_MAX_REQUESTS;

  return {
    allowed,
    remaining,
    resetAt: existing.resetAt,
  };
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isPublic = isPublicApiPath(pathname);

  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  if (isPublic) {
    const rateLimit = applyPublicRateLimit(request);

    if (!rateLimit.allowed) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      );

      const headers = new Headers({
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(PUBLIC_RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": "0",
      });

      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers,
        }
      );
    }

    const remainingHeader = Math.max(0, rateLimit.remaining).toString();
    return NextResponse.next({
      headers: new Headers({
        "X-RateLimit-Limit": String(PUBLIC_RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": remainingHeader,
      }),
    });
  }

  const authorizationHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization") ||
    "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);
    const headers = new Headers(request.headers);
    headers.set(
      "x-user",
      JSON.stringify({
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      })
    );

    return NextResponse.next({ request: { headers } });
  } catch (error) {
    console.error("Middleware auth error", error);

    const headers = new Headers();
    if (error?.name === "TokenExpiredError") {
      headers.set("X-Auth-Error", "access_token_expired");
    } else {
      headers.set("X-Auth-Error", "unauthorized");
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers,
      }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
