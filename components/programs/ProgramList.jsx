"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth, AuthError } from "@/lib/apiClient";
import ProgramForm from "@/components/programs/ProgramForm";
import ProgramDetails from "@/components/programs/ProgramDetails";
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
  RefreshCw,
  MapPin,
  Users,
  Calendar,
  Trash2,
  Clock,
  Eye,
  Pencil,
  Plus,
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

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms({ silent = false } = {}) {
    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const response = await fetchWithAuth(
        "/api/programs?includeLocation=true"
      );
      const data = await response.json();

      if (response.ok) {
        setPrograms(data.programs);
        if (!silent) {
          setError("");
        }
      } else if (!silent) {
        setError(data.error || "Failed to fetch programs");
      } else {
        console.error("Fetch programs failed:", data);
      }
    } catch (err) {
      const message =
        err instanceof AuthError
          ? err.message
          : "Network error. Please try again.";
      if (!silent) {
        setError(message);
      } else {
        console.error("Fetch programs error:", err);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this program?")) return;

    setDeleteLoading(id);
    try {
      const response = await fetchWithAuth(`/api/programs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete program");
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
    setEditingProgram(null);
    setFormOpen(true);
  }

  function handleOpenEdit(program) {
    setEditingProgram(program);
    setFormOpen(true);
  }

  function handleFormOpenChange(open) {
    setFormOpen(open);
    if (!open) {
      setEditingProgram(null);
    }
  }

  function handleProgramSaved() {
    setEditingProgram(null);
    fetchPrograms({ silent: true });
  }

  async function handleOpenDetails(programId) {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsError("");
    setSelectedProgram(null);

    try {
      const response = await fetchWithAuth(`/api/programs/${programId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedProgram(data.program);
      } else {
        setDetailsError(data.error || "Failed to fetch program details");
      }
    } catch (err) {
      const message =
        err instanceof AuthError
          ? err.message
          : "Network error. Please try again.";
      setDetailsError(message);
    } finally {
      setDetailsLoading(false);
    }
  }

  function handleDetailsOpenChange(open) {
    setDetailsOpen(open);
    if (!open) {
      setDetailsError("");
      setSelectedProgram(null);
      setDetailsLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-medium">Error loading programs</p>
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
          <h2 className="text-2xl font-bold">Your Programs</h2>
          <p className="text-muted-foreground text-sm">
            {programs.length} program{programs.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchPrograms()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleOpenCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Button>
        </div>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No programs yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first training program to get started.
              </p>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {program.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={program.isActive ? "default" : "secondary"}
                      >
                        {program.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {program._count && (
                        <Badge variant="outline">
                          {program._count.sessions} session
                          {program._count.sessions !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDetails(program.id)}
                      aria-label="View program details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(program)}
                      aria-label="Edit program"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(program.id)}
                      disabled={deleteLoading === program.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete program"
                    >
                      {deleteLoading === program.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {program.description && (
                  <CardDescription className="line-clamp-2">
                    {program.description}
                  </CardDescription>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{program.location?.name || "No location"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{program.seats} seats available</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(program.startTime)} -{" "}
                      {formatTime(program.endTime)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProgramForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSuccess={handleProgramSaved}
        initialData={editingProgram}
      />

      <ProgramDetails
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
        program={selectedProgram}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
}
