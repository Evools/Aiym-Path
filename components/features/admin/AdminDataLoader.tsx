"use client";

import React from "react";
import { Loader2, Database } from "lucide-react";

interface AdminDataLoaderProps {
  title?: string;
  subtitle?: string;
  minHeight?: string;
}

export const AdminDataLoader: React.FC<AdminDataLoaderProps> = ({
  title = "Загрузка данных из базы данных...",
  subtitle = "Подключение к PostgreSQL и получение актуальных записей",
  minHeight = "min-h-[320px]",
}) => {
  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-white/70 border border-[#E1E1E1] backdrop-blur-xs animate-in fade-in duration-200`}
    >
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(7,98,106,0.08)] flex items-center justify-center text-[#07626A]">
          <Database className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
          <Loader2 className="w-4 h-4 text-[#07626A] animate-spin" />
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-[#0D0D0D]">
        {title}
      </h3>
      <p className="text-xs text-[#0D0D0D]/55 mt-1 max-w-sm">
        {subtitle}
      </p>

      {/* Pulsing loading bar */}
      <div className="w-36 h-1 bg-[rgba(7,98,106,0.12)] rounded-full overflow-hidden mt-4">
        <div className="w-full h-full bg-[#07626A] rounded-full animate-[shimmer_1.5s_infinite_linear] origin-left-right" />
      </div>
    </div>
  );
};

export const AdminCardSkeleton: React.FC<{ count?: number; type?: "route" | "guide" | "location" | "card" }> = ({
  count = 4,
  type = "card",
}) => {
  return (
    <div
      className={`grid gap-5 ${
        type === "guide" || type === "location"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col justify-between gap-4 animate-pulse"
        >
          <div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3.5 bg-gray-200 rounded-md w-1/3" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                <div className="h-3 bg-gray-100 rounded-md w-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="h-12 bg-gray-100 rounded-xl" />
              <div className="h-12 bg-gray-100 rounded-xl" />
              <div className="h-12 bg-gray-100 rounded-xl" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-8 bg-gray-200 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AdminMetricsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col justify-between animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="w-9 h-9 rounded-xl bg-gray-100" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-8 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
