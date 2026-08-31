"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Map,
  Users,
  Building2,
  Plus,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import {
  AdminStorageService,
  AdminGuideItem,
  AdminLocationItem,
  AdminProjectContacts,
} from "@/lib/services/admin-storage.service";
import { RouteItem } from "@/types/route.types";
import { GuidebookItem } from "@/types/guidebook.types";
import { useToast } from "@/context/ToastContext";

export default function AdminDashboardPage() {
  const toast = useToast();
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [guides, setGuides] = useState<AdminGuideItem[]>([]);
  const [locations, setLocations] = useState<AdminLocationItem[]>([]);
  const [guidebookItems, setGuidebookItems] = useState<GuidebookItem[]>([]);
  const [contacts, setContacts] = useState<AdminProjectContacts | null>(null);

  useEffect(() => {
    setRoutes(AdminStorageService.getRoutes());
    setGuides(AdminStorageService.getGuides());
    setLocations(AdminStorageService.getLocations());
    setGuidebookItems(AdminStorageService.getGuidebookItems());
    setContacts(AdminStorageService.getContacts());
  }, []);

  const handleResetData = async () => {
    const isConfirmed = await toast.confirm({
      title: "Сбросить все данные?",
      message: "Все добавленные и отредактированные маршруты, гиды, локации, путеводитель и контакты будут возвращены к исходным значениям по умолчанию.",
      confirmText: "Сбросить данные",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      AdminStorageService.resetAll();
      setRoutes(AdminStorageService.getRoutes());
      setGuides(AdminStorageService.getGuides());
      setLocations(AdminStorageService.getLocations());
      setGuidebookItems(AdminStorageService.getGuidebookItems());
      setContacts(AdminStorageService.getContacts());
      toast.success("Данные успешно сброшены к начальным значениям");
    }
  };

  const totalKm = routes.reduce((acc, r) => acc + (r.distanceKm || 0), 0);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(7,98,106,0.08)] text-[#07626A] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Панель управления CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Обзор платформы Aiym Path
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управляйте пешими маршрутами, верификацией женских гидов, базами отдыха, статьями путеводителя и контактами.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-rose-300 text-xs font-bold text-[#0D0D0D]/75 hover:text-rose-600 transition-colors cursor-pointer"
            title="Сбросить к исходным данным"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сброс данных</span>
          </button>

          <Link
            href="/admin/routes/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Новый маршрут</span>
          </Link>
        </div>
      </div>

      {/* Key Metric Summary Cards (5 columns / grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Metric 1: Routes */}
        <Link
          href="/admin/routes"
          className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#0D0D0D]/60 tracking-wider">
              Маршруты
            </span>
            <div className="w-9 h-9 rounded-xl bg-[rgba(7,98,106,0.08)] text-[#07626A] flex items-center justify-center">
              <Map className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#0D0D0D]">
              {routes.length}
            </span>
            <p className="text-[11px] text-[#0D0D0D]/50 mt-1">
              ~{totalKm.toFixed(1)} км GPS треков
            </p>
          </div>
        </Link>

        {/* Metric 2: Female Guides */}
        <Link
          href="/admin/guides"
          className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#0D0D0D]/60 tracking-wider">
              Женские гиды
            </span>
            <div className="w-9 h-9 rounded-xl bg-[rgba(7,98,106,0.08)] text-[#07626A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#0D0D0D]">
              {guides.length}
            </span>
            <p className="text-[11px] text-[#0D0D0D]/50 mt-1">
              Верифицированные гиды
            </p>
          </div>
        </Link>

        {/* Metric 3: Safe Locations & Hubs */}
        <Link
          href="/admin/locations"
          className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#0D0D0D]/60 tracking-wider">
              Базы & Отели
            </span>
            <div className="w-9 h-9 rounded-xl bg-[rgba(7,98,106,0.08)] text-[#07626A] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#0D0D0D]">
              {locations.length}
            </span>
            <p className="text-[11px] text-[#0D0D0D]/50 mt-1">
              Проверенные базы отдыха
            </p>
          </div>
        </Link>

        {/* Metric 4: Guidebook */}
        <Link
          href="/admin/guidebook"
          className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#0D0D0D]/60 tracking-wider">
              Путеводитель
            </span>
            <div className="w-9 h-9 rounded-xl bg-[rgba(7,98,106,0.08)] text-[#07626A] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#0D0D0D]">
              {guidebookItems.length}
            </span>
            <p className="text-[11px] text-[#0D0D0D]/50 mt-1">
              Статей и рекомендаций
            </p>
          </div>
        </Link>

        {/* Metric 5: Contacts & SOS */}
        <Link
          href="/admin/contacts"
          className="p-5 rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#0D0D0D]/60 tracking-wider">
              Контакты & SOS
            </span>
            <div className="w-9 h-9 rounded-xl bg-[rgba(7,98,106,0.08)] text-[#07626A] flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#0D0D0D]">
              {contacts?.emergencyContacts.length || 7}
            </span>
            <p className="text-[11px] text-[#0D0D0D]/50 mt-1">
              Экстренных служб и горячих линий
            </p>
          </div>
        </Link>
      </div>

      {/* Routes Quick Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0D0D0D]">
              Актуальные маршруты
            </h3>
            <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
              Список пеших троп, опубликованных на интерактивной карте
            </p>
          </div>

          <Link
            href="/admin/routes"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#07626A] hover:underline"
          >
            <span>Все маршруты ({routes.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-[#E1E1E1] border-t border-[#E1E1E1] -mx-6 px-6">
          {routes.slice(0, 5).map((route) => {
            return (
              <div
                key={route.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(7,98,106,0.08)] text-[#07626A] flex items-center justify-center shrink-0 font-bold text-xs">
                    {route.region === "ala-archa" ? "AA" : route.region === "alamedin" ? "AL" : "CH"}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#0D0D0D] truncate">
                      {route.title.ru}
                    </h4>
                    <p className="text-xs text-[#0D0D0D]/60 truncate">
                      {route.distanceKm} км • ~{route.durationHours} ч • +{route.elevationGainMeters} м • {route.coordinates.length} точек трека
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Link
                    href={`/admin/routes/${route.id}`}
                    className="px-3 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#07626A] text-[#0D0D0D] hover:text-white text-xs font-bold transition-colors"
                  >
                    Редактировать
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
