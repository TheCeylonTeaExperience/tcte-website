"use client";

import BookingForm from "@/components/bookings/BookingForm";
import { useDashboard } from "../layout";

export default function BookingsPage() {
  useDashboard();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">
          Capture bookings on behalf of leaders, manage attendee details, and track availability in real time.
        </p>
      </div>

      <BookingForm />
    </div>
  );
}
