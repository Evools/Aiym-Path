"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  TrendingUp,
  Trash2,
  Edit,
  Eye,
  Footprints,
  Users,
} from "lucide-react";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { RouteItem, RouteFilterRegion } from "@/types/route.types";
import { useToast } from "@/context/ToastContext";

export default function AdminRoutesPage() {
  const toast = useToast();
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RouteFilterRegion>("all");

  useEffect(() => {
    setRoutes(AdminStorageService.getRoutes());
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить маршрут?",
      message: `Вы уверены, что хотите удалить маршрут «${title}»?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      AdminStorageService.deleteRoute(id);
      setRoutes(AdminStorageService.getRoutes());
      toast.success(`Маршрут «${title}» удален`);
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesRegion =
      selectedRegion === "all" || route.region === selectedRegion;
    const matchesSearch =
      route.title.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.title.en && route.title.en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.title.kg && route.title.kg.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header with Title & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Маршруты (Routes CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управление пешими туристическими тропами, привязкой треков OSM и гидов.
          </p>
        </div>

        <Link
          href="/admin/routes/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить маршрут</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#0D0D0D]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#F3F3F3] border border-transparent focus:border-[#07626A] focus:bg-white text-xs font-medium text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Все регионы" },
            { id: "ala-archa", label: "Ала-Арча" },
            { id: "alamedin", label: "Аламедин" },
            { id: "chunkurchak", label: "Чункурчак" },
          ].map((tab) => {
            const isSelected = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id as RouteFilterRegion)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-[#07626A] text-white border-[#07626A]"
                    : "bg-white text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Routes Grid / Cards */}
      {filteredRoutes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E1E1E1]">
          <Footprints className="w-10 h-10 text-[#07626A]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0D0D0D]">Маршруты не найдены</h3>
          <p className="text-xs text-[#0D0D0D]/60 mt-1 mb-4">
            Попробуйте изменить параметры поиска или добавьте новый маршрут.
          </p>
          <Link
            href="/admin/routes/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Создать маршрут</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRoutes.map((route) => {
            const guidesCount =
              route.assignedGuides?.length || (route.assignedGuide ? 1 : 0);

            return (
              <div
                key={route.id}
                className="p-5 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Top info row with cover */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-20 h-20 rounded-2xl bg-[#F3F3F3] overflow-hidden shrink-0 border border-[#E1E1E1]">
                      {route.imageUrl ? (
                        <Image
                          src={route.imageUrl}
                          alt={route.title.ru}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#07626A]">
                          OSM
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[10px] font-bold uppercase">
                          {route.region}
                        </span>
                        <span className="text-[10px] text-[#0D0D0D]/50 font-bold uppercase">
                          {route.difficulty}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#0D0D0D] leading-snug line-clamp-1">
                        {route.title.ru}
                      </h3>
                      <p className="text-xs text-[#0D0D0D]/65 line-clamp-2 mt-1">
                        {route.description.ru}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2 rounded-xl bg-[#F3F3F3] border border-[#E1E1E1]">
                      <span className="text-[10px] text-[#0D0D0D]/50 block font-medium">
                        Дистанция
                      </span>
                      <span className="text-xs font-bold text-[#0D0D0D]">
                        {route.distanceKm} км
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F3F3F3] border border-[#E1E1E1]">
                      <span className="text-[10px] text-[#0D0D0D]/50 block font-medium">
                        Время
                      </span>
                      <span className="text-xs font-bold text-[#0D0D0D]">
                        ~{route.durationHours} ч
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F3F3F3] border border-[#E1E1E1]">
                      <span className="text-[10px] text-[#0D0D0D]/50 block font-medium">
                        Подъем
                      </span>
                      <span className="text-xs font-bold text-[#0D0D0D]">
                        +{route.elevationGainMeters} м
                      </span>
                    </div>
                  </div>

                  {/* Attached Guides & GPS Point count */}
                  <div className="flex items-center justify-between text-xs text-[#0D0D0D]/60 mt-3 pt-3 border-t border-[#E1E1E1]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#07626A]" />
                      <span>Привязано гидов: {guidesCount}</span>
                    </span>

                    <span className="font-mono font-bold text-[11px]">
                      {route.coordinates.length} точек GPS
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <Link
                    href={`/map?route=${route.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#07626A] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>На карте</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(route.id, route.title.ru)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Удалить маршрут"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/admin/routes/${route.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#07626A] text-[#0D0D0D] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Изменить</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
