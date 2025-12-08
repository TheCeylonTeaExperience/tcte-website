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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth, AuthError } from "@/lib/apiClient";
import { useDashboard } from "../layout";
import { Loader2, Plus, Pencil } from "lucide-react";

export default function LeadersPage() {
  useDashboard();

  const [leaders, setLeaders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingLeader, setEditingLeader] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    contact: "",
    role: "USER",
    status: "ACTIVE",
  });

  const loadLeaders = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth("/api/leaders", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch leaders");
      const { leaders: payload } = await response.json();
      setLeaders(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Leaders fetch error:", err);
      setError(err.message || "Unable to load leaders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadLeaders();
  }, [loadLeaders]);

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      email: leader.email,
      contact: leader.contact || "",
      role: leader.role,
      status: leader.status || "ACTIVE", // Assuming API returns status, if not default to ACTIVE
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingLeader(null);
    setFormData({
      name: "",
      email: "",
      contact: "",
      role: "USER",
      status: "ACTIVE",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLeader
        ? `/api/leaders/${editingLeader.id}`
        : "/api/leaders";
      const method = editingLeader ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save leader");
      }

      alert(`Leader ${editingLeader ? "updated" : "created"} successfully.`);
      setIsDialogOpen(false);
      loadLeaders();
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leaders</h2>
          <p className="text-muted-foreground">
            Manage leaders, roles, and promo codes.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Leader
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leaders</CardTitle>
          <CardDescription>
            A list of all registered leaders and users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-destructive p-4">{error}</div>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Promo Code</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaders.map((leader) => (
                    <TableRow key={leader.id}>
                      <TableCell className="font-medium">{leader.name}</TableCell>
                      <TableCell>{leader.email}</TableCell>
                      <TableCell>
                        <Badge variant={leader.role === "LEADER" ? "default" : "secondary"}>
                          {leader.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <Badge variant={leader.status === "DEACTIVATED" ? "destructive" : "outline"}>
                          {leader.status || "ACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell>{leader.promoteCode || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(leader)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLeader ? "Edit Leader" : "Add Leader"}</DialogTitle>
            <DialogDescription>
              {editingLeader
                ? "Update leader details, role, and status."
                : "Create a new leader account."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!!editingLeader} // Disable email edit for existing
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="LEADER">Leader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
