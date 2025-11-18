import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function parseTimeValue(value) {
  if (!value) return null;

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const timeMatch = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (timeMatch) {
    const [, hours, minutes, seconds] = timeMatch;
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes || "0", 10));
    date.setSeconds(parseInt(seconds || "0", 10));
    date.setMilliseconds(0);
    return date;
  }

  return null;
}

function parseId(rawId) {
  const id = Number.parseInt(rawId, 10);
  return Number.isNaN(id) ? null : id;
}

// GET /api/programs/[id] - Get a single program
export async function GET(request, context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id == null) {
      return NextResponse.json(
        { error: "Invalid program id" },
        { status: 400 }
      );
    }

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        location: true,
        sessions: {
          include: {
            _count: {
              select: { sessionTypes: true },
            },
            sessionTypes: {
              orderBy: {
                price: "asc",
              },
            },
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Get program error:", error);
    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

// PUT /api/programs/[id] - Update a program
export async function PUT(request, context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id == null) {
      return NextResponse.json(
        { error: "Invalid program id" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const {
      title,
      description,
      startTime,
      endTime,
      locationId,
      seats,
      isActive,
    } = body;

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime !== undefined) {
      const parsedStart = parseTimeValue(startTime);
      if (!parsedStart) {
        return NextResponse.json(
          { error: "Invalid start time format" },
          { status: 400 }
        );
      }
      updateData.startTime = parsedStart;
    }

    if (endTime !== undefined) {
      const parsedEnd = parseTimeValue(endTime);
      if (!parsedEnd) {
        return NextResponse.json(
          { error: "Invalid end time format" },
          { status: 400 }
        );
      }
      updateData.endTime = parsedEnd;
    }
    if (seats !== undefined) updateData.seats = Number.parseInt(seats, 10);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (locationId !== undefined) {
      // Verify location exists
      const location = await prisma.location.findUnique({
        where: { id: Number.parseInt(locationId, 10) },
      });
      if (!location) {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }
      updateData.locationId = Number.parseInt(locationId, 10);
    }

    const program = await prisma.program.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
      },
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Update program error:", error);
    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 }
    );
  }
}

// DELETE /api/programs/[id] - Soft delete a program
export async function DELETE(request, context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id == null) {
      return NextResponse.json(
        { error: "Invalid program id" },
        { status: 400 }
      );
    }

    const program = await prisma.program.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: "Program deleted successfully",
      program,
    });
  } catch (error) {
    console.error("Delete program error:", error);
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
