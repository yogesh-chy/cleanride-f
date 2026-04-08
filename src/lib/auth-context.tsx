"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

export type UserRole = "admin" | "staff" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = Cookies.get("access_token");
      if (accessToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/me/`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token might be expired, clear everything
            handleLogoutLogic();
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens in cookies
        Cookies.set("access_token", data.access, { expires: 1, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
        Cookies.set("refresh_token", data.refresh, { expires: 7, secure: process.env.NODE_ENV === "production", sameSite: "strict" });

        // Fetch user profile to get role and details
        const profileRes = await fetch(`${API_BASE_URL}/me/`, {
          headers: { "Authorization": `Bearer ${data.access}` },
        });

        if (profileRes.ok) {
          const userData = await profileRes.json();
          setUser(userData);
          // Store role in a separate cookie for easy middleware access (non-httpOnly for client side check)
          Cookies.set("user_role", userData.role, { expires: 7 });
          return { success: true };
        }
      }
      return { success: false, error: data.detail || "Invalid email or password" };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (response.ok) {
        // According to API doc, register returns "Register Successfully" string
        // We'll return success so the UI can redirect to login
        return { success: true };
      }
      
      const data = await response.json();
      return { success: false, error: data.email?.[0] || data.phone?.[0] || "Registration failed" };
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const handleLogoutLogic = () => {
    setUser(null);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_role");
  };

  const logout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    const accessToken = Cookies.get("access_token");

    if (refreshToken && accessToken) {
      try {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }
    handleLogoutLogic();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
