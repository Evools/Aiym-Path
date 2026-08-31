"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = "aiym_path_admin_session_v1";

const DEFAULT_ADMIN_USER: AdminUser = {
  id: "admin-1",
  name: "Айым Администратор",
  email: "admin@aiympath.kg",
  role: "Главный администратор",
  avatar: "/images/guides/guide-2.jpg",
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) {
          setIsAuthenticated(true);
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Demo validation: accepts admin@aiympath.kg (or admin) with password "admin" (or standard admin passwords)
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Заполните все поля для входа" };
    }

    if (
      (cleanEmail === "admin@aiympath.kg" || cleanEmail === "admin" || cleanEmail === "admin@tumar.kg") &&
      (cleanPass === "admin" || cleanPass === "admin123" || cleanPass === "aiym2026")
    ) {
      const sessionUser: AdminUser = {
        ...DEFAULT_ADMIN_USER,
        email: cleanEmail.includes("@") ? cleanEmail : "admin@aiympath.kg",
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    // Also allow any valid email + pass >= 4 chars for testing ease if specified
    if (cleanEmail.includes("@") && cleanPass.length >= 4) {
      const customUser: AdminUser = {
        id: `admin-${Date.now()}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        role: "Редактор платформы",
        avatar: "/images/guides/guide-3.jpg",
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(customUser));
      setUser(customUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      error: "Неверный логин или пароль (Демо: admin@aiympath.kg / admin)",
    };
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
