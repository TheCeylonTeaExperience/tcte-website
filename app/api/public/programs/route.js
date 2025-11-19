import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
            _count: {
              select: { sessionTypes: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Public programs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
