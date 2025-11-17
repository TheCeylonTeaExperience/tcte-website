"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirect to login
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if API fails, clear local data and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.name || user.email}!
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">{user.email}</p>
              </div>
              {user.name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm">{user.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <p className="text-sm capitalize">{user.role}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Authentication status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-sm">Logged in</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
