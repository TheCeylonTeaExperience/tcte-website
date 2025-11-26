import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function buildDateRange(date) {
  const start = new Date(date);
  if (Number.isNaN(start.getTime())) {
    return null;
  }
  const rangeStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);
  return { rangeStart, rangeEnd };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionIdParam = searchParams.get("sessionId");
    const dateParam = searchParams.get("date");

    if (!sessionIdParam || !dateParam) {
      return NextResponse.json(
        { error: "sessionId and date are required" },
        { status: 400 }
      );
    }

    const sessionId = Number.parseInt(sessionIdParam, 10);
    if (Number.isNaN(sessionId)) {
      return NextResponse.json(
        { error: "Invalid sessionId" },
        { status: 400 }
      );
    }

    const range = buildDateRange(dateParam);
    if (!range) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }

    const availability = await prisma.availability.findFirst({
      where: {
        sessionId,
        deletedAt: null,
        date: {
          gte: range.rangeStart,
          lt: range.rangeEnd,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Get availability error", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId: rawSessionId, date, seats } = body ?? {};

    if (!rawSessionId || !date) {
      return NextResponse.json(
        { error: "sessionId and date are required" },
        { status: 400 }
      );
    }

    const sessionId = Number.parseInt(rawSessionId, 10);
    if (Number.isNaN(sessionId)) {
      return NextResponse.json(
        { error: "Invalid sessionId" },
        { status: 400 }
      );
    }

    const range = buildDateRange(date);
    if (!range) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        deletedAt: null,
        program: {
          deletedAt: null,
        },
      },
      include: {
        program: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const capacitySource = seats ?? session.program?.seats ?? null;
    const parsedSeats = Number.parseInt(capacitySource, 10);

    if (Number.isNaN(parsedSeats) || parsedSeats <= 0) {
      return NextResponse.json(
        { error: "Seats must be a positive number" },
        { status: 400 }
      );
    }

    const existing = await prisma.availability.findFirst({
      where: {
        sessionId,
        deletedAt: null,
        date: {
          gte: range.rangeStart,
          lt: range.rangeEnd,
        },
      },
    });

    let availability;

    if (existing) {
      availability = await prisma.availability.update({
        where: { id: existing.id },
        data: {
          availableSeats: parsedSeats,
        },
      });
    } else {
      availability = await prisma.availability.create({
        data: {
          sessionId,
          date: range.rangeStart,
          availableSeats: parsedSeats,
        },
      });
    }

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Upsert availability error", error);
    return NextResponse.json(
      { error: "Failed to upsert availability" },
      { status: 500 }
    );
  }
}
