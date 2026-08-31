import React from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminAuthGuard } from "@/components/features/admin/AdminAuthGuard";

export const metadata = {
  title: "Aiym Path Admin | CMS",
  description: "Панель управления безопасными маршрутами, женскими гидами и локациями.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </AdminAuthProvider>
  );
}
