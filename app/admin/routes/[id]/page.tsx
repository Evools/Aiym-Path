"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertCircle,
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

export default function EditRoutePage() {
  const router = useRouter();
  const params = useParams();
  const routeId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [availableGuides, setAvailableGuides] = useState<AdminGuideItem[]>([]);

  const [title, setTitle] = useState({ ru: "", kg: "", en: "" });
  const [description, setDescription] = useState({ ru: "", kg: "", en: "" });
  const [region, setRegion] = useState<RouteRegion>("ala-archa");
  const [difficulty, setDifficulty] = useState<RouteItem["difficulty"]>("medium");
  const [distanceKm, setDistanceKm] = useState<number>(5.5);
  const [durationHours, setDurationHours] = useState<number>(3.0);
  const [elevationGainMeters, setElevationGainMeters] = useState<number>(350);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    const guides = AdminStorageService.getGuides();
    setAvailableGuides(guides);

    const existingRoute = AdminStorageService.getRouteById(routeId);
    if (existingRoute) {
      setTitle({
        ru: existingRoute.title.ru || "",
        kg: existingRoute.title.kg || "",
        en: existingRoute.title.en || "",
      });
      setDescription({
        ru: existingRoute.description.ru || "",
        kg: existingRoute.description.kg || "",
        en: existingRoute.description.en || "",
      });
      setRegion(existingRoute.region);
      setDifficulty(existingRoute.difficulty);
      setDistanceKm(existingRoute.distanceKm);
      setDurationHours(existingRoute.durationHours);
      setElevationGainMeters(existingRoute.elevationGainMeters);
      setImageUrl(existingRoute.imageUrl || "");
      setCoordinates(existingRoute.coordinates || []);

      // Guides
      if (existingRoute.assignedGuides && existingRoute.assignedGuides.length > 0) {
        const matchingIds = guides
          .filter((g) =>
            existingRoute.assignedGuides?.some((ag) => ag.name === g.name)
          )
          .map((g) => g.id);
        setSelectedGuideIds(matchingIds);
      } else if (existingRoute.assignedGuide) {
        const match = guides.find((g) => g.name === existingRoute.assignedGuide?.name);
        if (match) setSelectedGuideIds([match.id]);
      }
    }
    setIsLoading(false);
  }, [routeId]);

  const handleToggleGuide = (id: string) => {
    setSelectedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.ru.trim()) {
      alert("Пожалуйста, укажите название маршрута");
      return;
    }

    if (coordinates.length < 2) {
      alert("Пожалуйста, оставьте на карте минимум 2 точки маршрута");
      return;
    }

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

    const updatedRoute: RouteItem = {
      id: routeId,
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
          id: `${routeId}-poi-start`,
          name: { ru: "Старт маршрута", kg: "Маршруттун башталышы", en: "Trail Start" },
          lat: coordinates[0][0],
          lng: coordinates[0][1],
          type: "service",
        },
        {
          id: `${routeId}-poi-finish`,
          name: { ru: "Финишная панорама", kg: "Панорамалык чекит", en: "Trail Finish" },
          lat: coordinates[coordinates.length - 1][0],
          lng: coordinates[coordinates.length - 1][1],
          type: "viewpoint",
        },
      ],
    };

    AdminStorageService.saveRoute(updatedRoute);
    router.push("/admin/routes");
  };

  const handleDelete = () => {
    if (confirm("Вы точно хотите удалить этот маршрут?")) {
      AdminStorageService.deleteRoute(routeId);
      router.push("/admin/routes");
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-[#0D0D0D]/60">
        Загрузка данных маршрута...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
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
              Редактирование: {title.ru || "Маршрут"}
            </h1>
            <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
              ID: <span className="font-mono">{routeId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
            title="Удалить маршрут"
          >
            <Trash2 className="w-4 h-4" />
          </button>

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
            <span>Сохранить изменения</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multilingual Content & Metrics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Multilingual Titles & Descriptions */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              1. Текстовое описание (i18n RU • KG • EN)
            </h3>

            <I18nFieldEditor
              label="Название маршрута"
              required
              value={title}
              onChange={setTitle}
            />

            <I18nFieldEditor
              label="Описание и особенности маршрута"
              isTextarea
              rows={4}
              value={description}
              onChange={setDescription}
            />
          </div>

          {/* 2. Route Metrics & Difficulty */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-5">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              2. Характеристики и сложность
            </h3>

            {/* Custom Selects for Region & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                label="Регион / Ущелье"
                value={region}
                onChange={(val) => setRegion(val as RouteRegion)}
                options={[
                  { value: "ala-archa", label: "Ала-Арча (Ala-Archa)", sublabel: "Национальный парк" },
                  { value: "alamedin", label: "Аламедин (Alamedin)", sublabel: "Ущелье и водопады" },
                  { value: "chunkurchak", label: "Чункурчак (Chunkurchak)", sublabel: "Горные панорамы" },
                ]}
              />

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
            </div>

            {/* 3 Numerical Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-1.5">
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
                <label className="block text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-1.5">
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
                <label className="block text-[11px] font-bold text-[#0D0D0D]/60 uppercase tracking-wider mb-1.5">
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

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                URL обложки маршрута
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
              />
            </div>
          </div>

          {/* 3. Assign Verified Female Guides with Custom Checkboxes */}
          <div className="p-6 rounded-3xl bg-white border border-[#E1E1E1] flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              3. Привязка женских гидов
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableGuides.map((guide) => {
                const isChecked = selectedGuideIds.includes(guide.id);

                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => handleToggleGuide(guide.id)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer text-left w-full ${
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

        {/* Right Column: Interactive Map Editor (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
          <div className="p-6 rounded-3xl bg-white border border-[#E1E1E1]">
            <RouteMapEditorWrapper
              coordinates={coordinates}
              onChangeCoordinates={setCoordinates}
              center={
                coordinates[0] ||
                (region === "ala-archa"
                  ? [42.5644, 74.4823]
                  : region === "alamedin"
                  ? [42.6318, 74.6727]
                  : [42.6389, 74.6281])
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}
