"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminStorageService, AdminGuideItem } from "@/lib/services/admin-storage.service";
import { GuideItem, INITIAL_GUIDES } from "@/data/guides.data";
import { GuideCard } from "./GuideCard";

export const GuideListSection: React.FC = () => {
  const { dict } = useLanguage();
  const [guides, setGuides] = useState<(AdminGuideItem | GuideItem)[]>(INITIAL_GUIDES);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "guide" | "agency">("all");

  useEffect(() => {
    async function loadGuides() {
      const dbGuides = await AdminStorageService.getGuides();
      if (dbGuides && dbGuides.length > 0) {
        setGuides(dbGuides);
      }
    }
    loadGuides();
  }, []);

  const locations = useMemo(() => {
    const locSet = new Set<string>();
    guides.forEach((g) => {
      if (g.locations) {
        g.locations.forEach((l) => locSet.add(l));
      }
    });
    return ["all", ...Array.from(locSet)];
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      // Category filter
      if (selectedCategory !== "all" && guide.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (
        selectedLocation !== "all" &&
        (!guide.locations ||
          !guide.locations.some(
            (l) => l.toLowerCase() === selectedLocation.toLowerCase()
          ))
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = guide.name.toLowerCase().includes(query);
        const matchesLoc =
          guide.locations &&
          guide.locations.some((l) => l.toLowerCase().includes(query));
        const matchesRole =
          typeof (guide as AdminGuideItem).role === "object"
            ? Object.values((guide as AdminGuideItem).role).some((r) =>
                r?.toLowerCase().includes(query)
              )
            : false;
        if (!matchesName && !matchesLoc && !matchesRole) return false;
      }

      return true;
    });
  }, [guides, selectedCategory, selectedLocation, searchQuery]);

  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Controls Bar: Search & Category Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.guides?.searchPlaceholder || "Поиск по имени, региону или специализации..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E1E1E1] bg-white text-xs sm:text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:border-[#07626A] transition-colors"
              />
            </div>

            {/* Category Switcher Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] self-start md:self-auto shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#07626A] text-white shadow-xs"
                    : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
                }`}
              >
                Все ({guides.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("guide")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "guide"
                    ? "bg-[#07626A] text-white shadow-xs"
                    : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
                }`}
              >
                {dict.guides?.titlePrefix || "Женские гиды"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("agency")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "agency"
                    ? "bg-[#07626A] text-white shadow-xs"
                    : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
                }`}
              >
                {dict.guides?.titleHighlight || "Агентства и клубы"}
              </button>
            </div>
          </div>

          {/* Location Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none pt-1">
            <div className="w-7 h-7 rounded-xl bg-[#F0F2F2] flex items-center justify-center text-[#07626A] shrink-0 border border-[#E1E1E1]">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc;
              const label = loc === "all" ? dict.guides?.allLocations || "Все локации" : loc;

              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                      : "bg-[#F0F2F2] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)] hover:bg-white"
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
          <div className="text-center py-16 px-4 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1]">
            <Users className="w-10 h-10 text-[#07626A]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0D0D0D] mb-1">
              Специалисты не найдены
            </h3>
            <p className="text-xs text-[#0D0D0D]/60 max-w-sm mx-auto">
              Попробуйте изменить параметры поиска или выбрать другую локацию.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
