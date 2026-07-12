"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import type { AuthUser, LoginRequest } from "@/types/auth";
import { roleDashboardPath } from "@/utils/routes";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getCurrentUser();
      setUser(result.user);
      return result.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (payload: LoginRequest) => {
      setError(null);
      setIsLoading(true);
      try {
        const result = await loginRequest(payload);
        setUser(result.user);
        router.push(roleDashboardPath[result.user.role]);
      } catch (requestError) {
        const message = requestError instanceof ApiError ? requestError.message : "Unable to sign in.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => undefined);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      login,
      logout,
      refreshUser,
      clearError: () => setError(null)
    }),
    [error, isLoading, login, logout, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
