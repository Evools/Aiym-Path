"use client";

import React from "react";
import Link from "next/link";
import { Plus, ShieldCheck, Map, Eye } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  actionButton,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E1E1E1] px-6 py-4 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-[#0D0D0D] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Live Public Map Preview */}
        <Link
          href="/map"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F3F3F3] hover:bg-[#E1E1E1] text-[#0D0D0D] text-xs font-bold transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-[#07626A]" />
          <span>Предпросмотр карты</span>
        </Link>

        {/* Action Button */}
        {actionButton && (
          <Link
            href={actionButton.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            {actionButton.icon || <Plus className="w-4 h-4" />}
            <span>{actionButton.label}</span>
          </Link>
        )}
      </div>
    </header>
  );
};
