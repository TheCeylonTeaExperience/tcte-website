"use client";

import SessionList from "@/components/sessions/SessionList";
import { useDashboard } from "../layout";

export default function ProgramsPage() {
  useDashboard();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Program Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and update the programs scheduled for your sessions.
          </p>
        </div>
      </div>

      <SessionList />
    </div>
  );
}
