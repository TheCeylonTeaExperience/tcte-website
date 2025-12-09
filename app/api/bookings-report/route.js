import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        leaderId: true,
        paymentType: true,
        amount: true,
        balance: true,
        paymentId: true,
        status: true,
        createdAt: true,
        payment: {
          select: {
            amount: true,
            orderId: true,
          },
        },
        leader: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the response to flatten the payment fields
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      leaderId: booking.leaderId,
      type: booking.paymentType,
      amount: booking.amount,
      balance: booking.balance,
      payment_id: booking.paymentId,
      status: booking.status,
      createdAt: booking.createdAt,
      payment_amount: booking.payment?.amount || null,
      order_id: booking.payment?.orderId || null,
      leader: booking.leader,
    }));

    return NextResponse.json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings report" },
      { status: 500 }
    );
  }
}
