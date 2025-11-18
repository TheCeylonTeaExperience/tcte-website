"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth, AuthError } from "@/lib/apiClient";
import SessionForm from "@/components/sessions/SessionForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Clock,
  DollarSign,
  Trash2,
  Pencil,
  Plus,
  Layers3,
  MapPin,
} from "lucide-react";

function formatTime(value) {
  if (!value) return "—";

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return value;
  }

  return dateValue.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [programFilter, setProgramFilter] = useState("");
  const [programs, setPrograms] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [programFilter]);

  async function fetchPrograms() {
    try {
      const response = await fetchWithAuth(
        "/api/programs?includeLocation=true"
      );
      const data = await response.json();
      if (response.ok) {
        setPrograms(data.programs);
      }
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Failed to fetch programs";
      console.error("Failed to fetch programs:", err);
      console.error(message);
    }
  }

  async function fetchSessions({ silent = false } = {}) {
    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const url = programFilter
        ? `/api/sessions?programId=${programFilter}`
        : "/api/sessions";
      const response = await fetchWithAuth(url);
      const data = await response.json();

      if (response.ok) {
        setSessions(data.sessions);
      } else if (!silent) {
        setError(data.error || "Failed to fetch sessions");
      }
    } catch (err) {
      const message =
        err instanceof AuthError
          ? err.message
          : "Network error. Please try again.";
      if (!silent) {
        setError(message);
      } else {
        console.error("Fetch sessions error:", err);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this session?")) return;

    setDeleteLoading(id);
    try {
      const response = await fetchWithAuth(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete session");
      }
    } catch (err) {
      alert(
        err instanceof AuthError
          ? err.message
          : "Network error. Please try again."
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  function handleOpenCreate() {
    setEditingSession(null);
    setFormOpen(true);
  }

  function handleOpenEdit(session) {
    setEditingSession(session);
    setFormOpen(true);
  }

  function handleFormOpenChange(open) {
    setFormOpen(open);
    if (!open) {
      setEditingSession(null);
    }
  }

  function handleSessionSaved() {
    setEditingSession(null);
    fetchSessions({ silent: true });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-medium">Error loading sessions</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sessions</h2>
          <p className="text-muted-foreground text-sm">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            value={programFilter || "all"}
            onValueChange={(value) =>
              setProgramFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Filter by program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {programs.map((prog) => (
                <SelectItem key={prog.id} value={String(prog.id)}>
                  {prog.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => fetchSessions()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleOpenCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-4">
                Create a session to start scheduling your program lineup.
              </p>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {session.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      {session.program?.title && (
                        <Badge variant="secondary">
                          {session.program.title}
                        </Badge>
                      )}
                      {typeof session._count?.sessionTypes === "number" && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Layers3 className="h-3.5 w-3.5" />
                          {session._count.sessionTypes} type
                          {session._count.sessionTypes === 1 ? "" : "s"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(session)}
                      aria-label="Edit session"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(session.id)}
                      disabled={deleteLoading === session.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete session"
                    >
                      {deleteLoading === session.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm">
                  Scheduled times and pricing details for this session.
                </CardDescription>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(session.startTime)} —{" "}
                      {formatTime(session.endTime)}
                    </span>
                  </div>
                  {session.price != null && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{currencyFormatter.format(session.price)}</span>
                    </div>
                  )}
                  {session.program?.location?.name && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{session.program.location.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SessionForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSuccess={handleSessionSaved}
        initialData={editingSession}
      />
    </div>
  );
}
