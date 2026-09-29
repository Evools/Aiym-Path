"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  RotateCcw,
  Backpack,
  Sparkles,
  MapPin,
} from "lucide-react";
import { EQUIPMENT_CHECKLIST } from "@/data/guidebook.data";
import { ChecklistItem, EquipmentCategory } from "@/types/guidebook.types";
import { AdminStorageService, AdminLocationItem } from "@/lib/services/admin-storage.service";
import { INITIAL_LOCATIONS } from "@/data/locations.data";
import { useLanguage } from "@/context/LanguageContext";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { DifficultyLevelsGuideSection } from "./DifficultyLevelsGuideSection";

export const EquipmentChecklistSection: React.FC = () => {
  const { language, dict } = useLanguage();
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(EQUIPMENT_CHECKLIST);
  const [locations, setLocations] = useState<AdminLocationItem[]>(INITIAL_LOCATIONS as unknown as AdminLocationItem[]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | EquipmentCategory>("all");
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const [dbLocs, dbItems] = await Promise.all([
        AdminStorageService.getLocations(),
        AdminStorageService.getChecklistItems(),
      ]);
      if (dbLocs && dbLocs.length > 0) {
        setLocations(dbLocs);
      }
      if (dbItems && dbItems.length > 0) {
        setChecklistItems(dbItems);
      }
    }
    loadData();

    window.addEventListener("focus", loadData);
    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Filter items by location and category
  const filteredItems = useMemo(() => {
    return checklistItems.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Location filter: if "all", show everything; otherwise show universal items + items for this location
      if (selectedLocationId !== "all") {
        if (item.locationIds && item.locationIds.length > 0) {
          if (!item.locationIds.includes(selectedLocationId)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [checklistItems, selectedLocationId, selectedCategory]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setCheckedIds([]);
  };

  const total = filteredItems.length;
  const current = filteredItems.filter((i) => checkedIds.includes(i.id)).length;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const categories: { id: "all" | EquipmentCategory; label: { ru: string; kg: string; en: string } }[] = [
    { id: "all", label: { ru: "Все категории", kg: "Бардык категориялар", en: "All Categories" } },
    { id: "clothing", label: { ru: "Одежда и обувь", kg: "Кийим жана бут кийим", en: "Clothing & Footwear" } },
    { id: "navigation", label: { ru: "Навигация и связь", kg: "Навигация жана байланыш", en: "Navigation & Comms" } },
    { id: "safety", label: { ru: "Аптечка и безопасность", kg: "Аптечка жана коопсуздук", en: "First-Aid & Safety" } },
    { id: "hygiene", label: { ru: "Гигиена и вода", kg: "Гигиена жана суу", en: "Hygiene & Water" } },
  ];

  return (
    <section className="py-14 sm:py-18 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#07626A] text-xs font-bold uppercase tracking-wider mb-2.5 bg-[#F0F2F2]">
              <Backpack className="w-3.5 h-3.5" />
              <span>{dict.guidebook?.checklistTitle || "Чек-лист экипировки"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight uppercase">
              {language === "kg"
                ? "Тоо треккингине керектүү буюмдар"
                : language === "en"
                ? "Essential Mountain Trekking Checklist"
                : "Что взять с собой в горный треккинг"}
            </h2>
            <p className="text-xs sm:text-sm text-[#0D0D0D]/70 mt-1.5 max-w-xl">
              {language === "kg"
                ? "Локацияны тандап, тоого чыгаар алдында рюкзактагы буюмдарды белгилеп алыңыз"
                : language === "en"
                ? "Select your destination location and check off essential gear in your backpack"
                : "Выберите конкретную локацию и отметьте вещи, которые вы уже собрали в рюкзак"}
            </p>
          </div>

          {/* Progress Tracker & Reset Button */}
          <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-[#E1E1E1] self-start md:self-auto">
            <div className="text-left">
              <span className="text-xs text-[#0D0D0D]/70 font-semibold block">
                {dict.guidebook?.checklistProgress || "Собрано"}: {current} / {total}
              </span>
              <div className="w-36 h-2 rounded-full overflow-hidden mt-1.5 bg-[#F0F2F2]">
                <div
                  className="h-full bg-[#07626A] transition-all duration-300 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {current > 0 && (
              <button
                type="button"
                onClick={handleReset}
                title={dict.guidebook?.checklistReset || "Сбросить"}
                className="p-2 rounded-xl text-[#0D0D0D]/60 hover:text-[#07626A] hover:bg-[#F0F2F2] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Location Filter Pills (Connected with Locations from Admin/DB) */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#07626A]" />
            <span className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
              {language === "kg"
                ? "Локация боюнча ылайыкташтыруу:"
                : language === "en"
                ? "Tailor by Location:"
                : "Адаптировать под локацию:"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
            <button
              type="button"
              onClick={() => setSelectedLocationId("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedLocationId === "all"
                  ? "bg-[#07626A] text-white border-[#07626A]"
                  : "bg-[#F0F2F2] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] hover:bg-white"
              }`}
            >
              {language === "kg" ? "Бардык локациялар" : language === "en" ? "All Locations" : "Все локации"}
            </button>

            {locations.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              const title = loc.title[language as "ru" | "kg" | "en"] || loc.title.ru;

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#07626A] text-white border-[#07626A]"
                      : "bg-[#F0F2F2] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] hover:bg-white"
                  }`}
                >
                  {title}
                </button>
              );
            })}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar select-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const label = cat.label[language as "ru" | "kg" | "en"] || cat.label.ru;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#07626A]/10 text-[#07626A] font-bold"
                      : "text-[#0D0D0D]/60 hover:text-[#0D0D0D] hover:bg-[#F0F2F2]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Checklist Grid with CustomCheckbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            const label = item.label[language as "ru" | "kg" | "en"] || item.label.ru;
            const note = item.note ? item.note[language as "ru" | "kg" | "en"] || item.note.ru : null;
            const essentialText =
              dict.guidebook?.essentialNote ||
              (language === "kg" ? "Сөзсүз керек" : language === "en" ? "Essential" : "Обязательно");

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-2xl text-left transition-colors duration-150 cursor-pointer border select-none ${
                  isChecked
                    ? "bg-[#F0F2F2] border-[#07626A]/40"
                    : "bg-white border-[#E1E1E1] hover:border-[#07626A]/50"
                }`}
              >
                <CustomCheckbox
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                  label={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-semibold transition-colors ${
                          isChecked ? "line-through text-[#0D0D0D]/45" : "text-[#0D0D0D]"
                        }`}
                      >
                        {label}
                      </span>
                      {item.isEssential && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#07626A]/10 text-[#07626A] shrink-0">
                          {essentialText}
                        </span>
                      )}
                    </div>
                  }
                  description={note || undefined}
                />
              </div>
            );
          })}
        </div>

        {percentage === 100 && total > 0 && (
          <div className="mt-6 p-4 rounded-2xl border border-[#07626A]/30 bg-[#F0F2F2] text-[#07626A] flex items-center gap-3 text-xs sm:text-sm font-bold">
            <Sparkles className="w-5 h-5 shrink-0 text-[#07626A]" />
            <span>
              {dict.guidebook?.checklistCompleted ||
                "Отлично! Вы полностью готовы к безопасному и комфортному горному походу."}
            </span>
          </div>
        )}

        {/* Bottom Information Block by Difficulty Level (Инфа по уровню сложности) */}
        <DifficultyLevelsGuideSection />
      </div>
    </section>
  );
};
