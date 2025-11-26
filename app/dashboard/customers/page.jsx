"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchWithAuth, AuthError } from "@/lib/apiClient";
import { useDashboard } from "../layout";

const statusVariantMap = {
  Active: "default",
  "At Risk": "destructive",
  Paused: "secondary",
  Upcoming: "secondary",
  "No Sessions": "outline",
};

export default function CustomersPage() {
  useDashboard();

  const [leaders, setLeaders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeLeader, setActiveLeader] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function loadLeaders() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth("/api/customers", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customer assignments");
        }

        const { leaders: payload } = await response.json();
        if (!isMounted) return;

        setLeaders(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Customers fetch error:", err);
        if (!isMounted) return;
        const message =
          err instanceof AuthError
            ? err.message
            : "Unable to load customer data right now.";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLeaders();

    return () => {
      isMounted = false;
    };
  }, []);

  function formatLastSession(dateString) {
    if (!dateString) return "No sessions yet";

    try {
      const parsed = new Date(dateString);
      if (Number.isNaN(parsed.getTime())) {
        return "No sessions yet";
      }

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsed);
    } catch (err) {
      console.warn("Date format error", err);
      return "No sessions yet";
    }
  }

  function handleViewCustomers(leader) {
    setActiveLeader(leader);
    setIsDialogOpen(true);
  }

  function handleDialogChange(open) {
    if (!open) {
      setIsDialogOpen(false);
      setActiveLeader(null);
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Relationships</h1>
          <p className="text-muted-foreground mt-1">
            Monitor how your leaders are paired with active customers.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Leader to Customer Overview</CardTitle>
          <CardDescription>
            Snapshot of leadership assignments, engagement, and recent activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead className="hidden md:table-cell">Title</TableHead>
                  <TableHead className="hidden lg:table-cell text-center">
                    Customers
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-center">
                    Sessions
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Session</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-8">
                      <div className="flex justify-center">
                        <span className="text-sm text-muted-foreground">
                          Loading assignments...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-8">
                      <div className="flex justify-center">
                        <span className="text-sm text-destructive">
                          {error}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && leaders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-8">
                      <div className="flex justify-center">
                        <span className="text-sm text-muted-foreground">
                          No customer assignments yet.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error &&
                  leaders.map((leader) => (
                    <TableRow key={leader.leaderId}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{leader.leaderName}</span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {leader.leaderRole ?? "Leader"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {leader.leaderRole ?? "Leader"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">
                        {leader.totalCustomers}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">
                        {leader.totalSessions ?? 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariantMap[leader.status] ?? "secondary"}
                        >
                          {leader.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {formatLastSession(leader.latestSessionDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewCustomers(leader)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {activeLeader ? activeLeader.leaderName : "Leader customers"}
            </DialogTitle>
            <DialogDescription>
              {activeLeader
                ? `${activeLeader.totalCustomers} customers assigned to this leader.`
                : "Customers assigned to this leader."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="space-y-4">
              {activeLeader?.customers?.length ? (
                activeLeader.customers.map((customer) => (
                  <div
                    key={customer.customerId}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{customer.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.customerEmail}
                        </p>
                      </div>
                      <Badge
                        variant={statusVariantMap[customer.status] ?? "secondary"}
                      >
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                      <span>
                        <strong className="text-foreground">Sessions:</strong>{" "}
                        {customer.sessionsCount ?? 0}
                      </span>
                      <span>
                        <strong className="text-foreground">Program:</strong>{" "}
                        {customer.programTitle ?? "–"}
                      </span>
                      <span>
                        <strong className="text-foreground">Last Session:</strong>{" "}
                        {formatLastSession(customer.lastSessionDate)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center py-8">
                  <span className="text-sm text-muted-foreground">
                    No customers assigned yet.
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => handleDialogChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
