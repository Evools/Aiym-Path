"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_GUIDES, GuideItem } from "@/data/guides.data";
import { GuideCard } from "@/components/features/guide/GuideCard";

export const ToursGuideListSection: React.FC = () => {
  const { dict } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "guide" | "agency">("all");

  const locations = ["all", "Бишкек", "Каракол", "Нарын", "Ош", "Ала-Арча", "Аламедин"];

  const filteredGuides = useMemo(() => {
    return INITIAL_GUIDES.filter((guide) => {
      // Category filter
      if (selectedCategory !== "all" && guide.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "all" && !guide.locations.some((l) => l.toLowerCase() === selectedLocation.toLowerCase())) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = guide.name.toLowerCase().includes(query);
        const matchesLoc = guide.locations.some((l) => l.toLowerCase().includes(query));
        if (!matchesName && !matchesLoc) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedLocation, searchQuery]);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Controls Bar: Search & Location Filters */}
        <div className="mb-10 space-y-5">
          {/* Top Bar: Search Input & Category Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.guides.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-colors"
              />
            </div>

            {/* Category Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-gray-100/80 border border-gray-200/60 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Все ({INITIAL_GUIDES.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("guide")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "guide"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {dict.guides.titlePrefix}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("agency")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "agency"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {dict.guides.titleHighlight}
              </button>
            </div>
          </div>

          {/* Location Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc;
              const label = loc === "all" ? dict.guides.allLocations : loc;

              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#07626A] text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-gray-50 border border-gray-100">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Специалисты не найдены
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Попробуйте изменить параметры поиска или выбрать другую локацию.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
