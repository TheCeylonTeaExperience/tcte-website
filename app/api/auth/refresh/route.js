import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiryDate,
  verifyRefreshToken,
} from "@/lib/jwt";
import {
  clearRefreshTokenCookie,
  compareRefreshToken,
  hashRefreshToken,
  setRefreshTokenCookie,
} from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { id: decoded.jti },
    });

    if (!tokenRecord) {
      await clearRefreshTokenCookie(cookieStore);
      return NextResponse.json({ error: "Token not found" }, { status: 401 });
    }

    const matches = await compareRefreshToken(
      refreshToken,
      tokenRecord.hashedToken
    );
    if (!matches) {
      await clearRefreshTokenCookie(cookieStore);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (tokenRecord.revoked) {
      await clearRefreshTokenCookie(cookieStore);
      return NextResponse.json({ error: "Token revoked" }, { status: 401 });
    }

    if (tokenRecord.expiresAt <= new Date()) {
      await clearRefreshTokenCookie(cookieStore);
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      await clearRefreshTokenCookie(cookieStore);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Token rotation: delete the old token and mint a brand new pair.
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    const nextJti = randomUUID();
    const nextRefreshToken = generateRefreshToken(user.id, nextJti);
    const hashedNextToken = await hashRefreshToken(nextRefreshToken);
    const expiresAt = getRefreshTokenExpiryDate();

    await prisma.refreshToken.create({
      data: {
        id: nextJti,
        hashedToken: hashedNextToken,
        userId: user.id,
        expiresAt,
      },
    });

    await setRefreshTokenCookie(cookieStore, nextRefreshToken);

    const accessToken = generateAccessToken(user.id, user.email, user.role);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Refresh error", error);
    await clearRefreshTokenCookie(cookieStore);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
