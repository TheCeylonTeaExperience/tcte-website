"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/apiClient";
import LocationForm from "./LocationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/api/locations");
      const data = await response.json();
      if (response.ok) {
        setLocations(data.locations);
        setError("");
      } else {
        setError(data.error || "Failed to fetch locations");
      }
    } catch (err) {
      setError("Failed to load locations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this location?")) return;

    setDeleteLoading(id);
    try {
      const response = await fetchWithAuth(`/api/locations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLocations(locations.filter((loc) => loc.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete location");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete location");
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#767014' }}>Locations</h2>
          <p style={{ color: '#000000', opacity: 0.7 }}>
            Manage your physical locations and venues.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingLocation(null);
            setFormOpen(true);
          }}
          style={{ background: 'linear-gradient(to right, #767014, #C5BF81)', color: '#ffffff' }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-md border" style={{ backgroundColor: '#C5BF81', borderColor: '#767014', color: '#000000' }}>{error}</div>
      )}

      <Card className="border-2" style={{ borderColor: '#C5BF81' }}>
        <CardHeader>
          <CardTitle style={{ color: '#767014' }}>All Locations</CardTitle>
          <CardDescription style={{ color: '#000000', opacity: 0.7 }}>
            A list of all active locations in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4" style={{ color: '#000000', opacity: 0.7 }}>Loading locations...</div>
          ) : locations.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#000000', opacity: 0.7 }}>
              No locations found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: '#767014', fontWeight: 600 }}>Name</TableHead>
                  <TableHead style={{ color: '#767014', fontWeight: 600 }}>Address</TableHead>
                  <TableHead className="text-right" style={{ color: '#767014', fontWeight: 600 }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: '#767014' }} />
                        <span style={{ color: '#000000' }}>{location.name}</span>
                      </div>
                    </TableCell>
                    <TableCell style={{ color: '#000000', opacity: 0.7 }}>{location.address || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingLocation(location);
                            setFormOpen(true);
                          }}
                          style={{ color: '#767014' }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(location.id)}
                          disabled={deleteLoading === location.id}
                          style={{ color: '#000000' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <LocationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingLocation}
        onSuccess={fetchLocations}
      />
    </div>
  );
}
