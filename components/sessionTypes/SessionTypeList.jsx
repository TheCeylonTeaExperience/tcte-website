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
  Sparkles,
  Calendar,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "LKR",
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-purple-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
          Loading session types...
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
              onClick={() => fetchSessionTypes()} 
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse"/>
              <h2 className="text-3xl font-bold">Session Types</h2>
            </div>
            <p className="text-purple-100 text-lg">
              {sessionTypes.length} amazing type{sessionTypes.length !== 1 ? "s" : ""} ready for action
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={sessionFilter || "all"}
              onValueChange={(value) =>
                setSessionFilter(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="sm:w-48 bg-white/10 backdrop-blur-sm border-white/30 text-white">
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
              className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Type
            </Button>
          </div>
        </div>
      </div>

      {sessionTypes.length === 0 ? (
        <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                <Layers3 className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                No session types yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first session type to define pricing and variations within your sessions!
              </p>
              <Button 
                onClick={handleOpenCreate}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Type
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessionTypes.map((sessionType, index) => {
            // Different gradient colors for variety
            const gradients = [
              "from-purple-500 to-pink-600",
              "from-fuchsia-500 to-purple-600",
              "from-rose-500 to-pink-600",
              "from-violet-500 to-purple-600",
              "from-pink-500 to-rose-600",
              "from-indigo-500 to-purple-600",
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <Card
                key={sessionType.id}
                className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300 overflow-hidden"
              >
                {/* Colorful Header */}
                <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3 group-hover:text-purple-600 transition-colors">
                        {sessionType.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {sessionType.session?.name && (
                          <Badge 
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-sm"
                          >
                            {sessionType.session.name}
                          </Badge>
                        )}
                        {sessionType.session?.program?.title && (
                          <Badge 
                            variant="outline"
                            className="border-2 border-indigo-200 bg-indigo-50 text-indigo-700"
                          >
                            {sessionType.session.program.title}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    Pricing and context details for this session variation.
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        {sessionType.specialPrice ? (
                          <>
                            <span className="text-xs text-muted-foreground line-through">
                              {currencyFormatter.format(sessionType.price ?? 0)}
                            </span>
                            <span className="text-sm font-bold text-red-600">
                              {currencyFormatter.format(sessionType.specialPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-green-900">
                            {currencyFormatter.format(sessionType.price ?? 0)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {sessionType.session?.program?.location?.name && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-purple-900">
                          {sessionType.session.program.location.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(sessionType)}
                      className="flex-1 border-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sessionType.id)}
                      disabled={deleteLoading === sessionType.id}
                      className="border-2 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      {deleteLoading === sessionType.id ? (
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

      <SessionTypeForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSuccess={handleSessionTypeSaved}
        initialData={editingSessionType}
      />
    </div>
  );
}
