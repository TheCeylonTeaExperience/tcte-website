"use client";

import { useCallback, useEffect, useState } from "react";
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
  Sparkles,
  Calendar,
} from "lucide-react";

function formatTime(value) {
  if (!value) return "—";

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return value;
  }

  const hours = String(dateValue.getUTCHours()).padStart(2, "0");
  const minutes = String(dateValue.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "LKR",
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

  const fetchPrograms = useCallback(async () => {
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
  }, []);

  const fetchSessions = useCallback(
    async ({ silent = false } = {}) => {
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
    },
    [programFilter]
  );

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Loading amazing sessions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="font-bold text-xl text-red-700 mb-2">Oops! Something went wrong</p>
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              onClick={() => fetchSessions()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl font-bold">Your Sessions</h2>
            </div>
            <p className="text-blue-100 text-lg">
              {sessions.length} amazing session{sessions.length !== 1 ? "s" : ""} ready to go
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={programFilter || "all"}
              onValueChange={(value) =>
                setProgramFilter(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="sm:w-48 bg-white/10 backdrop-blur-sm border-white/30 text-white">
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
              size="lg"
              disabled={loading}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Refresh
            </Button>
            <Button 
              onClick={handleOpenCreate} 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                No sessions yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first exciting session and start scheduling your program lineup!
              </p>
              <Button 
                onClick={handleOpenCreate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session, index) => {
            // Different gradient colors for variety
            const gradients = [
              "from-blue-500 to-indigo-600",
              "from-purple-500 to-pink-600",
              "from-cyan-500 to-blue-600",
              "from-orange-500 to-red-600",
              "from-green-500 to-teal-600",
              "from-violet-500 to-purple-600",
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <Card
                key={session.id}
                className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 overflow-hidden"
              >
                {/* Colorful Header */}
                <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3 group-hover:text-blue-600 transition-colors">
                        {session.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {session.program?.title && (
                          <Badge 
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-sm"
                          >
                            {session.program.title}
                          </Badge>
                        )}
                        {typeof session._count?.sessionTypes === "number" && (
                          <Badge
                            variant="outline"
                            className="border-2 border-purple-200 bg-purple-50 text-purple-700 flex items-center gap-1"
                          >
                            <Layers3 className="h-3.5 w-3.5" />
                            {session._count.sessionTypes} type
                            {session._count.sessionTypes === 1 ? "" : "s"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    Scheduled times and pricing details for this session.
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-cyan-900">
                        {formatTime(session.startTime)} — {formatTime(session.endTime)}
                      </span>
                    </div>
                    
                    {(session.price != null || session.specialPrice != null) && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          {session.specialPrice ? (
                            <>
                              <span className="text-xs text-muted-foreground line-through">
                                {currencyFormatter.format(session.price)}
                              </span>
                              <span className="text-sm font-bold text-red-600">
                                {currencyFormatter.format(session.specialPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-medium text-green-900">
                              {currencyFormatter.format(session.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {session.program?.location?.name && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-purple-900">
                          {session.program.location.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(session)}
                      className="flex-1 border-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
                      disabled={deleteLoading === session.id}
                      className="border-2 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      {deleteLoading === session.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
