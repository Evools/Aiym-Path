import React from "react";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

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
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col md:flex-row text-[#0D0D0D]">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Area - Full Width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
