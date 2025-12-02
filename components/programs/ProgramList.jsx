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
  Sparkles,
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-emerald-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Loading your amazing programs...
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
            <p className="font-bold text-xl text-red-700 mb-2">
              Oops! Something went wrong
            </p>
            <p className="text-sm text-red-600">{error}</p>
            <Button
              onClick={() => fetchPrograms()}
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl font-bold">Your Programs</h2>
            </div>
            <p className="text-emerald-100 text-lg">
              {programs.length} awesome program
              {programs.length !== 1 ? "s" : ""} ready to inspire
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => fetchPrograms()}
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
              className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Program
            </Button>
          </div>
        </div>
      </div>

      {programs.length === 0 ? (
        <Card className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                No programs yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first amazing training program and start inspiring
                your audience!
              </p>
              <Button
                onClick={handleOpenCreate}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Program
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => {
            // Different gradient colors for variety
            const gradients = [
              "from-emerald-500 to-teal-600",
              "from-blue-500 to-indigo-600",
              "from-purple-500 to-pink-600",
              "from-orange-500 to-red-600",
              "from-cyan-500 to-blue-600",
              "from-violet-500 to-purple-600",
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <Card
                key={program.id}
                className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-300 overflow-hidden"
              >
                {/* Colorful Header */}
                <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3 group-hover:text-emerald-600 transition-colors">
                        {program.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={program.isActive ? "default" : "secondary"}
                          className={program.isActive
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-sm"
                            : "bg-gray-200 text-gray-600"
                          }
                        >
                          {program.isActive ? "🟢 Active" : "⚫ Inactive"}
                        </Badge>
                        {program._count && (
                          <Badge
                            variant="outline"
                            className="border-2 border-purple-200 bg-purple-50 text-purple-700"
                          >
                            📚 {program._count.sessions} session
                            {program._count.sessions !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {program.description && (
                    <CardDescription className="line-clamp-2 text-base">
                      {program.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-blue-900">
                        {program.location?.name || "No location"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-purple-900">
                        {program.seats} seats available
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-orange-900">
                        {formatTime(program.startTime)} -{" "}
                        {formatTime(program.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(program.id)}
                      className="flex-1 border-2 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(program)}
                      className="flex-1 border-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(program.id)}
                      disabled={deleteLoading === program.id}
                      className="border-2 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      {deleteLoading === program.id ? (
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
