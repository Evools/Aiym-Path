"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isLoginPage) {
        router.replace("/admin/login");
      } else if (isAuthenticated && isLoginPage) {
        router.replace("/admin");
      }
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // If loading session state from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F7F9F9] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#07626A] animate-spin" />
        <span className="text-xs font-bold text-[#07626A] tracking-wider uppercase">
          Проверка авторизации...
        </span>
      </div>
    );
  }

  // If on login page, render just login without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated, render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated admin view with sidebar
  return (
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col md:flex-row text-[#0D0D0D]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 w-full">{children}</main>
      </div>
    </div>
  );
};
