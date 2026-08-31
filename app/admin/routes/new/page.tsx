"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  MapPin,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  ShieldCheck,
  Footprints,
  Check,
} from "lucide-react";
import {
  AdminStorageService,
  AdminGuideItem,
} from "@/lib/services/admin-storage.service";
import { RouteItem, RouteRegion, AssignedGuide } from "@/types/route.types";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { RouteMapEditorWrapper } from "@/components/features/admin/RouteMapEditorWrapper";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { RegionSelectWithAdd } from "@/components/features/admin/RegionSelectWithAdd";
import { useToast } from "@/context/ToastContext";

export default function CreateRoutePage() {
  const router = useRouter();
  const toast = useToast();
  const [availableGuides, setAvailableGuides] = useState<AdminGuideItem[]>([]);

  const [title, setTitle] = useState({ ru: "", kg: "", en: "" });
  const [description, setDescription] = useState({ ru: "", kg: "", en: "" });
  const [region, setRegion] = useState<RouteRegion>("ala-archa");
  const [difficulty, setDifficulty] = useState<RouteItem["difficulty"]>("medium");
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationHours, setDurationHours] = useState<number>(0);
  const [elevationGainMeters, setElevationGainMeters] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
  );
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    const guides = AdminStorageService.getGuides();
    setAvailableGuides(guides);
    if (guides.length > 0) {
      setSelectedGuideIds([guides[0].id]);
    }
  }, []);

  const handleToggleGuide = (id: string) => {
    setSelectedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  const handleMetricsCalculated = useCallback(
    (m: { distanceKm: number; durationHours: number; elevationGainMeters: number }) => {
      setDistanceKm(m.distanceKm);
      setDurationHours(m.durationHours);
      setElevationGainMeters(m.elevationGainMeters);
    },
    []
  );

  const handleDistanceCalculated = useCallback((dist: number) => {
    setDistanceKm(dist);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.ru.trim()) {
      toast.warning("Пожалуйста, укажите название маршрута на русском языке", "Заполните поле");
      return;
    }

    if (coordinates.length < 2) {
      toast.warning("Пожалуйста, поставьте на карте минимум 2 точки маршрута (Старт и Финиш)", "Карта маршрута");
      return;
    }

    // Build AssignedGuides objects
    const assignedGuides: AssignedGuide[] = availableGuides
      .filter((g) => selectedGuideIds.includes(g.id))
      .map((g) => ({
        name: g.name,
        role: g.role,
        image: g.image,
        phone: g.phone,
        experienceYears: g.experienceYears,
        languages: g.languages,
        isVerified: g.isVerified,
      }));

    const newRoute: RouteItem = {
      id: `route-${Date.now()}`,
      title: {
        ru: title.ru,
        kg: title.kg || title.ru,
        en: title.en || title.ru,
      },
      description: {
        ru: description.ru,
        kg: description.kg || description.ru,
        en: description.en || description.ru,
      },
      region,
      difficulty,
      distanceKm: Number(distanceKm),
      durationHours: Number(durationHours),
      elevationGainMeters: Number(elevationGainMeters),
      hasFemaleGuide: assignedGuides.length > 0,
      centerCoordinates: coordinates[0] || [42.5644, 74.4823],
      imageUrl,
      coordinates,
      assignedGuides,
      assignedGuide: assignedGuides[0],
      pois: [
        {
          id: `poi-start-${Date.now()}`,
          name: { ru: "Старт маршрута", kg: "Маршруттун башталышы", en: "Trail Start" },
          lat: coordinates[0][0],
          lng: coordinates[0][1],
          type: "service",
        },
        {
          id: `poi-finish-${Date.now()}`,
          name: { ru: "Финишная точка", kg: "Финиш чекити", en: "Trail Finish" },
          lat: coordinates[coordinates.length - 1][0],
          lng: coordinates[coordinates.length - 1][1],
          type: "viewpoint",
        },
      ],
    };

    AdminStorageService.saveRoute(newRoute);
    toast.success(`Маршрут «${title.ru}» успешно создан`);
    router.push("/admin/routes");
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Top Bar with Navigation & Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/routes"
            className="p-2.5 rounded-xl bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[#0D0D0D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
              Создание нового маршрута
            </h1>
            <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
              Заполните мультиязычные поля и нарисуйте трек на интерактивной карте OSM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/routes"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors"
          >
            Отмена
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить маршрут</span>
          </button>
        </div>
      </div>

      {/* 1. Main Info & Description */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-6 shadow-2xs">
        <div className="pb-3 border-b border-[#E1E1E1]">
          <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
            1. Основная информация и описание
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <I18nFieldEditor
              label="Название маршрута"
              required
              value={title}
              onChange={setTitle}
              placeholder={{
                ru: "Например: Водопад Ак-Сай и Хижина Рацека",
                kg: "Мисалы: Ак-Сай шаркыратмасы жана Рацек үйү",
                en: "E.g. Ak-Sai Waterfall & Ratsek Hut",
              }}
            />

            <I18nFieldEditor
              label="Описание и особенности маршрута"
              isTextarea
              rows={4}
              value={description}
              onChange={setDescription}
              placeholder={{
                ru: "Подробное описание тропы, перепадов высот, родников и панорамных видов...",
                kg: "Жолдун, бийиктиктин өзгөрүшүнүн жана кооз жерлердин толук сыпаттамасы...",
                en: "Detailed trail overview, elevations, fresh springs and panoramic viewpoints...",
              }}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <RegionSelectWithAdd
              label="Регион / Ущелье"
              value={region}
              onChange={setRegion}
            />

            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                URL обложки маршрута
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
              />
            </div>

            {imageUrl && (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#E1E1E1] bg-[#F0F2F2]">
                <img
                  src={imageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Full-Width Interactive Map Studio */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E1E1E1]">
          <div>
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              2. Интерактивная карта и GPS трек (OpenStreetMap)
            </h3>
            <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
              Укажите точки на карте — дистанция, время и перепад высот рассчитаются автоматически
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#07626A] bg-[#07626A]/10 px-3 py-1 rounded-xl">
              Точек в треке: {coordinates.length}
            </span>
          </div>
        </div>

        <RouteMapEditorWrapper
          coordinates={coordinates}
          onChangeCoordinates={setCoordinates}
          onDistanceCalculated={handleDistanceCalculated}
          onMetricsCalculated={handleMetricsCalculated}
          center={coordinates[0]}
        />
      </div>

      {/* 3. Metrics & Assigned Guides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Metrics & Difficulty (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              3. Характеристики и сложность
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Авто-расчёт с карты
            </span>
          </div>

          <CustomSelect
            label="Сложность маршрута"
            value={difficulty}
            onChange={(val) => setDifficulty(val as RouteItem["difficulty"])}
            options={[
              { value: "easy", label: "Лёгкая (Easy)", sublabel: "Подходит для новичков и семей" },
              { value: "medium", label: "Средняя (Moderate)", sublabel: "Базовая физическая форма" },
              { value: "hard", label: "Высокая (Difficult)", sublabel: "Крутой рельеф и скалы" },
            ]}
          />

          {/* Numerical Metrics Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                Дистанция (км)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                Время в пути (ч)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                Набор высоты (м)
              </label>
              <input
                type="number"
                step="10"
                required
                value={elevationGainMeters}
                onChange={(e) => setElevationGainMeters(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
              />
            </div>
          </div>
          <p className="text-[11px] text-[#0D0D0D]/50">
            Значения обновляются автоматически при прокладке трека на карте, но при необходимости вы можете скорректировать их вручную.
          </p>
        </div>

        {/* Right: Female Guides Selection (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              4. Закреплённые женские гиды
            </h3>
            <span className="text-xs text-[#07626A] font-bold">
              Выбрано: {selectedGuideIds.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableGuides.map((guide) => {
              const isChecked = selectedGuideIds.includes(guide.id);

              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => handleToggleGuide(guide.id)}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer text-left w-full ${
                    isChecked
                      ? "bg-[rgba(7,98,106,0.08)] border-[#07626A] shadow-2xs"
                      : "bg-white border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] hover:bg-[#F3F3F3]"
                  }`}
                >
                  {/* Custom Checkbox Box */}
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 border ${
                      isChecked
                        ? "bg-[#07626A] border-[#07626A] text-white"
                        : "bg-white border-[#E1E1E1]"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#0D0D0D] block truncate">
                      {guide.name}
                    </span>
                    <span className="text-[10px] text-[#0D0D0D]/60 block truncate mt-0.5">
                      {guide.role.ru} • {guide.experienceYears} лет опыта
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
