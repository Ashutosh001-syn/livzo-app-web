"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  handle: string;
  role: "user" | "host" | "admin";
  emailVerifiedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ ok: boolean; error?: string }>;
  signup: (
    displayName: string,
    handle: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string; fields?: Record<string, string>; requiresVerification?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (data: { displayName?: string; handle?: string }) => Promise<{ ok: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.data?.user) {
          setUser(data.data.user);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) {
        return { ok: false, error: data?.error?.message ?? "Sign in failed." };
      }
      await fetchCurrentUser();
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error occurred." };
    }
  };

  const signup = async (displayName: string, handle: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, handle, email, password }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) {
        return {
          ok: false,
          error: data?.error?.message ?? "Registration failed.",
          fields: data?.error?.fields,
        };
      }
      if (data.data?.requiresVerification) {
        return { ok: true, requiresVerification: true };
      }
      // If server auto-verifies, log user in
      await login(email, password);
      return { ok: true, requiresVerification: false };
    } catch {
      return { ok: false, error: "Network error occurred." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  const updateProfile = async (data: { displayName?: string; handle?: string }) => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || result?.error) {
        return { ok: false, error: result?.error?.message ?? "Profile update failed." };
      }
      setUser(result.data.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error occurred." };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok || result?.error) {
        return { ok: false, error: result?.error?.message ?? "Unable to resend verification email." };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error occurred." };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) {
        const result = await response.json();
        return { ok: false, error: result?.error?.message ?? "Failed to change password." };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error occurred." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        resendVerification,
        changePassword,
        refresh: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
