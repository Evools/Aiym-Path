"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Users,
  Compass,
  ArrowUpRight,
  Building2,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/context/ToastContext";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const toast = useToast();

  const navigation = [
    {
      name: "Дашборд",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Маршруты (Routes)",
      href: "/admin/routes",
      icon: Map,
      exact: false,
    },
    {
      name: "Гиды (Female Guides)",
      href: "/admin/guides",
      icon: Users,
      exact: false,
    },
    {
      name: "Базы отдыха & Хабы",
      href: "/admin/locations",
      icon: Building2,
      exact: false,
    },
  ];

  const handleLogout = async () => {
    const isConfirmed = await toast.confirm({
      title: "Выйти из админ-панели?",
      message: "Вы уверены, что хотите завершить текущую сессию администратора?",
      confirmText: "Выйти",
      cancelText: "Остаться",
      isDestructive: true,
    });

    if (isConfirmed) {
      logout();
      toast.info("Вы вышли из учетной записи администратора");
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E1E1E1] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Admin Brand Header */}
        <div className="p-6 border-b border-[#E1E1E1]">
          <Link href="/admin" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <span
                className="text-xl font-extrabold tracking-tight leading-none text-[#07626A]"
                style={{
                  fontFamily: "var(--font-nunito-sans), 'Nunito Sans', sans-serif",
                }}
              >
                Aiym Path
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[10px] font-extrabold uppercase">
                CMS
              </span>
            </div>
            <span className="text-[10px] text-[#0D0D0D]/50 font-semibold tracking-wider uppercase mt-1">
              Панель управления
            </span>
          </Link>
        </div>

        {/* Navigation List */}
        <div className="p-4 flex flex-col gap-1.5">
          <span className="px-3 text-[10px] font-bold uppercase text-[#0D0D0D]/40 tracking-wider mb-1 block">
            Основное управление
          </span>

          {navigation.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-[#07626A] text-white"
                    : "text-[#0D0D0D]/75 hover:bg-[#F3F3F3] hover:text-[#0D0D0D]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Admin User Info & Switchers */}
      <div className="p-4 border-t border-[#E1E1E1] flex flex-col gap-3">
        {/* User Card */}
        {user && (
          <div className="p-3 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-xl bg-[#07626A]/10 overflow-hidden shrink-0 border border-[#07626A]/20">
                <Image
                  src={user.avatar || "/images/guides/guide-2.jpg"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#0D0D0D] block truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#0D0D0D]/50 block truncate">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Выйти из админки"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Go to Public Website */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-3 rounded-xl bg-[#F3F3F3] hover:bg-[#E1E1E1]/60 text-[#0D0D0D] transition-colors text-xs font-bold group"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#07626A]" />
            <span>Открыть сайт</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#0D0D0D]/40 group-hover:text-[#07626A] transition-colors" />
        </Link>
      </div>
    </aside>
  );
};
