"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import PermissionsHierarchy from "@/components/profile/PermissionsHierarchy";
import { Protect, useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProfilePage() {
  return (
    <CustomUsersTable />
  );
}

function CreateUserForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const auth = useAuth();

  const permissionsHierarchyRef = useRef(null);

  const [formData, setFormData] = useState({
    designation: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.hasPermission("/profile", "READ_WRITE")) {
      setMessage({ text: "You do no have the required permission to perform this action.", type: "error" });
      return;
    }

    setMessage({ text: "", type: "" });
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setIsLoading(false);
      return;
    }

    if (permissionsHierarchyRef.current) {
      setMessage({ text: "Something went wrong!", type: "error" });
    }

    const payload = {
      ...formData,
      permissions: [...permissionsHierarchyRef.current.getPermissions()]
    };

    try {
      const res = await fetchWithAuth("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   name: formData.name,
        //   email: formData.email,
        //   password: formData.password,
        // }),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // setMessage({ text: "New admin user created successfully", type: "success" });
      setFormData({
        designation: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      props.onOpenChange(data.data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={props.isDialogOpen} onOpenChange={() => props.onOpenChange(null)}>
      <DialogContent className={"border-2"} style={{ borderColor: "#C5BF81" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#767014" }}>{props.editUser ? "Edit Custom User" : "Add Custom User"}</DialogTitle>
          <DialogDescription style={{ color: "#000", opacity: .7 }}>
            {props.editUser
              ? "Update custom user details and permission."
              : "Create a custom user account."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-1">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 p-2">
              {message.text && (
                <div
                  className={`text-sm p-3 rounded-md border ${message.type === "success"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                    }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newDesignation">Designation</Label>
                <Input
                  id="newDesignation"
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Supervisor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newName">Full Name</Label>
                <Input
                  id="newName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newEmail">Email Address</Label>
                <Input
                  id="newEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newAdminPassword">Password</Label>
                  <Input
                    id="newAdminPassword"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmAdminPassword">Confirm Password</Label>
                  <Input
                    id="confirmAdminPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                  />
                </div>
                <PermissionsHierarchy ref={permissionsHierarchyRef} />
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          {isLoading ? (
            <div className="flex justify-center p-2 rounded-sm" style={{ backgroundColor: "#767014", color: "#fff" }}>
              <Loader2 className="h-5 w-5 animate-spin" /> Submitting
            </div>
          ) : (<Button
            type="submit"
            style={{ backgroundColor: "#767014", color: "#fff" }}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>)}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const auth = useAuth();

  const permissionsHierarchyRef = useRef(null);

  const [formData, setFormData] = useState({
    designation: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!props.editUser) return;

    setFormData({
      designation: props.editUser.designation,
      name: props.editUser.name,
      email: props.editUser.email
    });
  }, [props.editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.hasPermission("/profile", "READ_WRITE")) {
      setMessage({ text: "You do no have the required permission to perform this action.", type: "error" });
      return;
    }

    setMessage({ text: "", type: "" });
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setIsLoading(false);
      return;
    }

    if (permissionsHierarchyRef.current) {
      setMessage({ text: "Something went wrong!", type: "error" });
    }

    const payload = {
      ...formData,
      userId: props.editUser.id,
      permissions: [...permissionsHierarchyRef.current.getPermissions()]
    };

    console.log(payload);

    try {
      const res = await fetchWithAuth("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   name: formData.name,
        //   email: formData.email,
        //   password: formData.password,
        // }),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // setMessage({ text: "User updated successfully", type: "success" });
      setFormData({
        designation: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      props.onOpenChange(data.data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={props.editUser} onOpenChange={() => props.onOpenChange(null)}>
      <DialogContent className={"border-2"} style={{ borderColor: "#C5BF81" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#767014" }}>{"Edit Custom User"}</DialogTitle>
          <DialogDescription style={{ color: "#000", opacity: .7 }}>
            Update custom user details and permission.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-1">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 p-2">
              {message.text && (
                <div
                  className={`text-sm p-3 rounded-md border ${message.type === "success"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                    }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newDesignation">Designation</Label>
                <Input
                  id="newDesignation"
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Supervisor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newName">Full Name</Label>
                <Input
                  id="newName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newEmail">Email Address</Label>
                <Input
                  id="newEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newAdminPassword">New Password</Label>
                  <Input
                    id="newAdminPassword"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmAdminPassword">Confirm New Password</Label>
                  <Input
                    id="confirmAdminPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                  />
                </div>
                <PermissionsHierarchy
                  ref={permissionsHierarchyRef}
                  initialPermissions={props.editUser && props.editUser.userPermissions}
                />
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          {isLoading ? (
            <div className="flex justify-center p-2 rounded-sm" style={{ backgroundColor: "#767014", color: "#fff" }}>
              <Loader2 className="h-5 w-5 animate-spin" /> Submitting
            </div>
          ) : (<Button
            type="submit"
            style={{ backgroundColor: "#767014", color: "#fff" }}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>)}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ViewUserForm(props) {
  const permissionsHierarchyRef = useRef(null);

  const [formData, setFormData] = useState({
    designation: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!props.viewUser) return;

    setFormData({
      designation: props.viewUser.designation,
      name: props.viewUser.name,
      email: props.viewUser.email
    });
  }, [props.viewUser]);

  return (
    <Dialog open={props.viewUser} onOpenChange={() => props.onOpenChange(null)}>
      <DialogContent className={"border-2"} style={{ borderColor: "#C5BF81" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#767014" }}>{"View Custom User"}</DialogTitle>
          <DialogDescription style={{ color: "#000", opacity: .7 }}>
            View custom user details and permission.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-1">
          <form>
            <div className="grid gap-4 py-4 p-2">

              <div className="space-y-2">
                <Label htmlFor="newDesignation">Designation</Label>
                <Input
                  readOnly
                  disabled
                  id="newDesignation"
                  type="text"
                  value={formData.designation}
                  required
                  placeholder="e.g. Supervisor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newName">Full Name</Label>
                <Input
                  readOnly
                  disabled
                  id="newName"
                  name="name"
                  type="text"
                  value={formData.name}
                  required
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newEmail">Email Address</Label>
                <Input
                  readOnly
                  disabled
                  id="newEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  required
                  placeholder="admin@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PermissionsHierarchy
                  ref={permissionsHierarchyRef}
                  initialPermissions={props.viewUser && props.viewUser.userPermissions}
                  disabled
                />
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            style={{ backgroundColor: "#767014", color: "#fff" }}
            onClick={props.onOpenChange(null)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserForm(props) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function confirmDelete() {
    if (!props.deleteUser) return;

    setDeleteLoading(true);

    try {
      const res = await fetchWithAuth(`/api/users?userId=${props.deleteUser.id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();

      props.onOpenChange(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <AlertDialog open={props.deleteUser} onOpenChange={props.handleDeleteUserFormOpen}>
      <AlertDialogContent className="border-2" style={{ borderColor: '#C5BF81' }}>
        <AlertDialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(197, 191, 129, 0.2)' }}>
            <AlertTriangle className="h-8 w-8" style={{ color: '#767014' }} />
          </div>
          <AlertDialogTitle className="text-center text-xl" style={{ color: '#767014' }}>
            Delete User?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center" style={{ color: '#000000', opacity: 0.7 }}>
            Are you want to sure delete this user?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-3">
          <AlertDialogCancel
            onClick={() => props.onOpenChange(null)}
            className="border-2"
            style={{ borderColor: '#C5BF81', color: '#767014' }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="border-0"
            style={{ backgroundColor: '#767014', color: '#ffffff' }}
          >
            {deleteLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  );
}

function CustomUsersTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const auth = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleView(user) {
    setViewUser(user);
  }

  function handleEdit(user) {
    setEditUser(user);
  }

  function handleDelete(user) {
    setDeleteUser(user);
  }

  function handleEditUserFormOpen(result) {
    if (editUser) {
      setEditUser(false);

      if (result) {
        setUsers(prev => prev.map((u) => {
          if (u.id === result.id) {
            return {
              ...result
            };
          }
          return u;
        }));
      }
    }
  }

  function handleCreateUserFormOpen(result) {
    if (createDialogOpen) {
      setCreateDialogOpen(false);

      if (result) {
        setUsers(prev => [...prev, result]);
      }
    }
  }

  function handleDeleteUserFormOpen(result) {
    if (deleteUser) {
      setDeleteUser(null);

      if (result) {
        setUsers(prev => prev.filter((u) => u.id !== result.id));
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "#767014" }}>Custom Users</h2>
            <p style={{ color: "#000000", opacity: .7 }}>
              Manage custom users with custom privileges.
            </p>
          </div>
          <Protect route={"/profile"} accessType={"READ_WRITE"}>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              style={{ background: "linear-gradient(to right, #767014, #C5BF81)", color: "#fff" }}>
              <Plus className="mr-2 h-4 w-4" /> Add Custom User
            </Button>
          </Protect>
        </div>

        <Card className={"border-2"} style={{ borderColor: "#C5BF81" }}>
          <CardHeader>
            <CardTitle style={{ color: "#767014" }}>All Custom Users</CardTitle>
            <CardDescription style={{ color: "#000", opacity: .7 }}>
              A list of all custom users with custom privileges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#767014" }} />
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md border border-red-200">
                {error}
              </div>
            ) : (
              <ScrollArea className={"h-[600px]"}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ color: "#767014", fontWeight: 600 }}>Designation</TableHead>
                      <TableHead style={{ color: "#767014", fontWeight: 600 }}>Full Name</TableHead>
                      <TableHead style={{ color: "#767014", fontWeight: 600 }}>Email</TableHead>
                      <TableHead className="flex justify-end" style={{ color: "#767014", fontWeight: 600 }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium" style={{ color: "#000" }}>{user.designation ?? "-"}</TableCell>
                        <TableCell className="font-medium" style={{ color: "#000" }}>{user.name ?? "-"}</TableCell>
                        <TableCell className="font-medium" style={{ color: "#000" }}>{user.email ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(user)}
                              style={{ color: "#767014" }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Protect route={"/profile"} accessType={"READ_WRITE"}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(user)}
                                style={{ color: "#767014" }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {auth.user.id !== user.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(user)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </Protect>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>


      <CreateUserForm
        isDialogOpen={createDialogOpen}
        onOpenChange={handleCreateUserFormOpen}
      />

      <EditUserForm
        editUser={editUser}
        onOpenChange={handleEditUserFormOpen}
      />

      <ViewUserForm
        viewUser={viewUser}
        onOpenChange={setViewUser}
      />

      <DeleteUserForm
        deleteUser={deleteUser}
        onOpenChange={handleDeleteUserFormOpen}
      />
    </>
  );
}