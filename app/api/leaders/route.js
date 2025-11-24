import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function resolveDisplayName(leader) {
  if (leader?.name) {
    const trimmed = leader.name.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  if (leader?.email) {
    return leader.email;
  }
  return `Leader #${leader?.id}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const where = {
      deletedAt: null,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { promoteCode: { contains: query, mode: "insensitive" } },
      ];
    }

    const leaders = await prisma.leader.findMany({
      where,
      include: {
        _count: {
          select: { customers: true, bookings: true },
        },
      },
      orderBy: [
        { name: "asc" },
        { email: "asc" },
      ],
    });

    const normalized = leaders.map((leader) => ({
      id: leader.id,
      name: leader.name,
      displayName: resolveDisplayName(leader),
      email: leader.email,
      contact: leader.contact,
      promoteCode: leader.promoteCode,
      role: leader.role,
      customersCount: leader._count.customers,
      bookingsCount: leader._count.bookings,
    }));

    return NextResponse.json({ leaders: normalized });
  } catch (error) {
    console.error("Get leaders error", error);
    return NextResponse.json(
      { error: "Failed to fetch leaders" },
      { status: 500 }
    );
  }
}
