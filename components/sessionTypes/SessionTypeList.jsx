"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWithAuth, AuthError } from "@/lib/apiClient";
import SessionTypeForm from "@/components/sessionTypes/SessionTypeForm";
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
  Layers3,
  DollarSign,
  Trash2,
  Pencil,
  Plus,
  MapPin,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function SessionTypeList() {
  const [sessionTypes, setSessionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [sessionFilter, setSessionFilter] = useState("");
  const [sessions, setSessions] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSessionType, setEditingSessionType] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetchWithAuth("/api/sessions");
      const data = await response.json();
      if (response.ok) {
        setSessions(data.sessions);
      }
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Failed to fetch sessions";
      console.error("Failed to fetch sessions:", err);
      console.error(message);
    }
  }, []);

  const fetchSessionTypes = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setLoading(true);
        setError("");
      }

      try {
        const url = sessionFilter
          ? `/api/session-types?sessionId=${sessionFilter}`
          : "/api/session-types";
        const response = await fetchWithAuth(url);
        const data = await response.json();

        if (response.ok) {
          setSessionTypes(data.sessionTypes);
        } else if (!silent) {
          setError(data.error || "Failed to fetch session types");
        }
      } catch (err) {
        const message =
          err instanceof AuthError
            ? err.message
            : "Network error. Please try again.";
        if (!silent) {
          setError(message);
        } else {
          console.error("Fetch session types error:", err);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [sessionFilter]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    fetchSessionTypes();
  }, [fetchSessionTypes]);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this session type?")) return;

    setDeleteLoading(id);
    try {
      const response = await fetchWithAuth(`/api/session-types/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSessionTypes((prev) => prev.filter((st) => st.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete session type");
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
    setEditingSessionType(null);
    setFormOpen(true);
  }

  function handleOpenEdit(sessionType) {
    setEditingSessionType(sessionType);
    setFormOpen(true);
  }

  function handleFormOpenChange(open) {
    setFormOpen(open);
    if (!open) {
      setEditingSessionType(null);
    }
  }

  function handleSessionTypeSaved() {
    setEditingSessionType(null);
    fetchSessionTypes({ silent: true });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading session types...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-medium">Error loading session types</p>
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
          <h2 className="text-2xl font-bold">Session Types</h2>
          <p className="text-muted-foreground text-sm">
            {sessionTypes.length} type{sessionTypes.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select
            value={sessionFilter || "all"}
            onValueChange={(value) =>
              setSessionFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Filter by session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sessions</SelectItem>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={String(session.id)}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => fetchSessionTypes()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleOpenCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Session Type
          </Button>
        </div>
      </div>

      {sessionTypes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Layers3 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No session types yet</h3>
              <p className="text-muted-foreground mb-4">
                Add session types to define pricing and variations within a
                session.
              </p>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Session Type
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sessionTypes.map((sessionType) => (
            <Card
              key={sessionType.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {sessionType.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      {sessionType.session?.name && (
                        <Badge variant="secondary">
                          {sessionType.session.name}
                        </Badge>
                      )}
                      {sessionType.session?.program?.title && (
                        <Badge variant="outline">
                          {sessionType.session.program.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(sessionType)}
                      aria-label="Edit session type"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sessionType.id)}
                      disabled={deleteLoading === sessionType.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete session type"
                    >
                      {deleteLoading === sessionType.id ? (
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
                  Pricing and context details for this session variation.
                </CardDescription>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {currencyFormatter.format(sessionType.price ?? 0)}
                    </span>
                  </div>
                  {sessionType.session?.program?.location?.name && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{sessionType.session.program.location.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SessionTypeForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSuccess={handleSessionTypeSaved}
        initialData={editingSessionType}
      />
    </div>
  );
}
