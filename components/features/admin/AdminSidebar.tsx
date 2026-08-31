"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Users,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  BookOpen,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

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

      {/* Bottom Switcher: Go to Public Website */}
      <div className="p-4 border-t border-[#E1E1E1] flex flex-col gap-2">
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
