"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Load user data from localStorage on initial mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                console.log(storedUser);
            } catch (e) {
                console.error("Failed to parse stored user session:", e);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    /**
     * Login handler
     * @param {Object} userData
     * @param {string} accessToken
     */
    const login = (userData, accessToken) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
        router.push("/dashboard");
    };

    /**
     * Logout handler
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        router.push("/login");
    };

    /**
     * Evaluates if the current user has access to a specific route
     * @param {string} routePath - The route to check (defaults to current pathname)
     * @param {string} [requiredAccess] - Optional level check: 'READ_ONLY' or 'READ_WRITE'
     * @returns {boolean}
     */
    const hasPermission = (routePath = pathname, requiredAccess = null) => {
        if (!user || !Array.isArray(user.permissions)) return false;

        // Direct exact path match or base route matching
        const matchingPermission = user.permissions.find(
            (p) => p.route === routePath || routePath.startsWith(p.route + "/")
        );

        if (!matchingPermission) return false;

        // If a specific access level (like READ_WRITE) is required
        if (requiredAccess === "READ_WRITE") {
            return matchingPermission.accessType === "READ_WRITE";
        }

        return true;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user - The authenticated user data object, or null if logged out.
 * @property {boolean} loading - Indicates if the authentication state is in progress.
 * @property {function(Object, string): void} login - Log the user in with user data and an access token.
 * @property {function(): void} logout - Clear the session and log the user out.
 * @property {function(string, string=): boolean} hasPermission - Checks if the user holds access for a path.
 */

/**
 * Custom hook for consuming auth state inside components.
 * @returns {AuthState} The complete authentication state and method context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

/**
 * Structural Component wrapper to conditionally hide layouts based on permission
 */
export function Protect({ children, fallback = null, route, accessType }) {
    const { hasPermission, loading } = useAuth();

    if (loading) return null; // Or a layout skeleton loader

    if (!hasPermission(route, accessType)) {
        return fallback;
    }

    return <>{children}</>;
}