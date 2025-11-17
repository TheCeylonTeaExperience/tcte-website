import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (request.method === "OPTIONS") {
    return NextResponse.next();
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
