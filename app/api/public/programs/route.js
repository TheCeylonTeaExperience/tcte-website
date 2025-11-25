import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function buildDateRange(date) {
  const baseDate = new Date(date);
  if (Number.isNaN(baseDate.getTime())) {
    return null;
  }

  const rangeStart = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate()
    )
  );
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);

  return { rangeStart, rangeEnd };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    let range = null;
    if (dateParam) {
      range = buildDateRange(dateParam);
      if (!range) {
        return NextResponse.json(
          { error: "Invalid date" },
          { status: 400 }
        );
      }
    }

    const programs = await prisma.program.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        location: { deletedAt: null },
      },
      include: {
        location: true,
        sessions: {
          where: { deletedAt: null },
          orderBy: { startTime: "asc" },
          include: {
            sessionTypes: {
              where: { deletedAt: null },
              orderBy: { price: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (programs.length === 0) {
      return NextResponse.json({ programs });
    }

    const sessionIds = [];
    for (const program of programs) {
      for (const session of program.sessions) {
        sessionIds.push(session.id);
      }
    }

    let availabilityMap = new Map();
    if (range && sessionIds.length > 0) {
      const availabilityRecords = await prisma.availability.findMany({
        where: {
          sessionId: { in: sessionIds },
          deletedAt: null,
          date: {
            gte: range.rangeStart,
            lt: range.rangeEnd,
          },
        },
      });

      availabilityMap = new Map(
        availabilityRecords.map((record) => [record.sessionId, record])
      );
    }

    const normalizedPrograms = programs.map((program) => {
      const parsedCapacity =
        typeof program.seats === "number"
          ? program.seats
          : Number.parseInt(program.seats ?? "", 10);
      const safeCapacity = Number.isNaN(parsedCapacity)
        ? null
        : Math.max(0, parsedCapacity);

      const sessions = program.sessions.map((session) => {
        const availabilityRecord = availabilityMap.get(session.id) || null;
        const rawAvailable =
          availabilityRecord?.availableSeats != null
            ? availabilityRecord.availableSeats
            : safeCapacity;
        const parsedAvailable = Number.parseInt(rawAvailable ?? "", 10);
        const safeAvailable = Number.isNaN(parsedAvailable)
          ? safeCapacity ?? null
          : Math.max(0, parsedAvailable);

        return {
          ...session,
          availabilityForDate: {
            availableSeats: safeAvailable,
            capacity: safeCapacity,
            source: availabilityRecord ? "record" : "fallback",
          },
        };
      });

      return {
        ...program,
        sessions,
      };
    });

    return NextResponse.json({ programs: normalizedPrograms });
  } catch (error) {
    console.error("Public programs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
