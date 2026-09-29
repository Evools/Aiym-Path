"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Users, Sparkles, UserCheck, ShieldCheck, Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminStorageService, AdminGuideItem } from "@/lib/services/admin-storage.service";
import { INITIAL_GUIDES, GuideItem } from "@/data/guides.data";
import { GuideCard } from "@/components/features/guide/GuideCard";

type GuideTabType = "all" | "guide" | "agency";

export const ToursGuideListSection: React.FC = () => {
  const { dict } = useLanguage();
  const [guides, setGuides] = useState<(AdminGuideItem | GuideItem)[]>(INITIAL_GUIDES);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<GuideTabType>("all");

  const loadGuides = async () => {
    try {
      const dbGuides = await AdminStorageService.getGuides();
      if (dbGuides && dbGuides.length > 0) {
        setGuides(dbGuides);
      }
    } catch (e) {
      console.error("Failed to load guides:", e);
    }
  };

  useEffect(() => {
    loadGuides();

    window.addEventListener("focus", loadGuides);
    return () => {
      window.removeEventListener("focus", loadGuides);
    };
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

  const guidesCount = useMemo(() => {
    return guides.filter((g) => g.category !== "agency").length;
  }, [guides]);

  const agencyCount = useMemo(() => {
    return guides.filter((g) => g.category === "agency").length;
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      // Category Tab Filter
      if (selectedTab === "guide") {
        if (guide.category === "agency") return false;
      } else if (selectedTab === "agency") {
        if (guide.category !== "agency") return false;
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
  }, [guides, selectedTab, selectedLocation, searchQuery]);

  const tabs: { id: GuideTabType; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: "all",
      label: dict.guides?.tabAll || "Все",
      count: guides.length,
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      id: "guide",
      label: dict.guides?.tabGuides || "Гиды",
      count: guidesCount,
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
    {
      id: "agency",
      label: dict.guides?.tabAgency || "Агентства и клубы",
      count: agencyCount,
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Controls Bar: Search & Category Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.guides?.searchPlaceholder || "Поиск по имени, региону или специализации..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E1E1] bg-white text-xs sm:text-sm text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:border-[#07626A] transition-colors"
              />
            </div>

            {/* Gender & Category Switcher Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] self-start lg:self-auto shrink-0 gap-1 overflow-x-auto no-scrollbar max-w-full">
              {tabs.map((tab) => {
                const isSelected = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#07626A] text-white"
                        : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
                        isSelected ? "bg-white/20 text-white" : "bg-black/5 text-[#0D0D0D]/60"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#07626A] text-white border-[#07626A]"
                      : "bg-[#F0F2F2] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A] hover:bg-white"
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
          <div className="text-center py-16 px-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1]">
            <Users className="w-10 h-10 text-[#07626A]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0D0D0D] mb-1">
              Специалисты не найдены
            </h3>
            <p className="text-xs text-[#0D0D0D]/60 max-w-sm mx-auto mb-3">
              Попробуйте изменить параметры поиска или сбросить фильтр.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTab("all");
                setSelectedLocation("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
