"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Building2,
  Tent,
  Radio,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  AdminStorageService,
  AdminLocationItem,
  DEFAULT_LOCATIONS,
} from "@/lib/services/admin-storage.service";
import { LocationCard } from "./LocationCard";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

export const LocationsSection: React.FC = () => {
  const { dict, language } = useLanguage();
  const [locations, setLocations] = useState<AdminLocationItem[]>(DEFAULT_LOCATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<"all" | "hotel" | "camp" | "hub">("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);

  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  const loadData = async () => {
    try {
      const data = await AdminStorageService.getLocations();
      if (data && data.length > 0) {
        setLocations(data);
      }
    } catch (e) {
      console.error("Failed to load locations:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("focus", loadData);
    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [selectedType]);

  const typeTabs: {
    id: "all" | "hotel" | "camp" | "hub";
    label: string;
    icon: React.ReactNode;
  }[] = useMemo(
    () => [
      {
        id: "all",
        label: dict.locations?.filterAllTypes || "Все объекты",
        icon: <Sparkles className="w-3.5 h-3.5" />,
      },
      {
        id: "hotel",
        label: dict.locations?.typeHotel || "Отели & Резорты",
        icon: <Building2 className="w-3.5 h-3.5" />,
      },
      {
        id: "camp",
        label: dict.locations?.typeCamp || "Лагеря & Юрты",
        icon: <Tent className="w-3.5 h-3.5" />,
      },
      {
        id: "hub",
        label: dict.locations?.typeHub || "Пункты помощи",
        icon: <Radio className="w-3.5 h-3.5" />,
      },
    ],
    [dict]
  );

  const filteredLocations = useMemo(() => {
    if (selectedType === "all") return locations;
    return locations.filter((loc) => loc.type === selectedType);
  }, [locations, selectedType]);

  const visibleLocations = useMemo(() => {
    return filteredLocations.slice(0, visibleCount);
  }, [filteredLocations, visibleCount]);

  const hasMore = visibleCount < filteredLocations.length;

  // IntersectionObserver for smooth scroll-triggered lazy loading
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isExpanding) {
          setIsExpanding(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filteredLocations.length));
            setIsExpanding(false);
          }, 160);
        }
      },
      {
        rootMargin: "250px 0px", // Preload slightly before the user reaches the end of list
        threshold: 0.1,
      }
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isExpanding, filteredLocations.length]);

  return (
    <section id="locations" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E1E1E1]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-3xl">
            {/* Label / Badge */}
            <span
              className="block text-sm sm:text-[15px] font-bold uppercase tracking-wider mb-2.5"
              style={{ color: "#07626A" }}
            >
              {dict.locations?.badge || "Кыргызстан"}
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0D0D0D] tracking-tight uppercase mb-3 leading-tight">
              {dict.locations?.title || "РЕГИОНЫ И ЛОКАЦИИ"}
            </h2>

            {/* Subtitle */}
            <p className="text-[13.5px] sm:text-[15px] text-[#0D0D0D]/70 leading-relaxed">
              {dict.locations?.subtitle ||
                "Исследуйте проверенные female-friendly базы отдыха, юрточные лагеря, отели и пункты отдыха по всей стране."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E1E1E1] bg-[#F0F2F2] hover:bg-[#EAF4F4] text-xs sm:text-sm font-bold text-[#07626A] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#07626A]" />
              <span>{dict.locations?.viewOnMap || "Смотреть на карте"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-[#0D0D0D]/60 uppercase tracking-wider min-w-[70px]">
            {language === "kg" ? "Категория:" : language === "en" ? "Category:" : "Категория:"}
          </span>
          <div className="inline-flex p-1 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] gap-1 overflow-x-auto no-scrollbar max-w-full">
            {typeTabs.map((tab) => {
              const isSelected = selectedType === tab.id;
              const count =
                tab.id === "all"
                  ? locations.length
                  : locations.filter((l) => l.type === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-2 ${
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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Locations Grid with Progressive Staggered Entrance on Scroll */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[380px] rounded-2xl bg-[#F0F2F2] animate-pulse border border-[#E1E1E1]"
              />
            ))}
          </div>
        ) : filteredLocations.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {visibleLocations.map((loc, index) => (
                <div
                  key={loc.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${(index % 6) * 45}ms`,
                  }}
                >
                  <LocationCard location={loc} />
                </div>
              ))}
            </div>

            {/* Scroll Observer Target & Smooth Loader */}
            {hasMore ? (
              <div
                ref={observerTargetRef}
                className="flex flex-col items-center justify-center py-6 min-h-[80px]"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F2F2] border border-[#E1E1E1] text-xs font-bold text-[#07626A]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#07626A]" />
                  <span>
                    {language === "kg"
                      ? "Дагы локациялар жүктөлүүдө..."
                      : language === "en"
                      ? "Loading more locations..."
                      : "Загрузка следующих локаций..."}
                  </span>
                </div>
              </div>
            ) : filteredLocations.length > INITIAL_VISIBLE_COUNT ? (
              <div className="flex items-center justify-center pt-2">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0F2F2] text-[#07626A] text-xs font-semibold border border-[#E1E1E1]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {language === "kg"
                      ? `Бардык ${filteredLocations.length} локация көрсөтүлдү`
                      : language === "en"
                      ? `All ${filteredLocations.length} locations displayed`
                      : `Показаны все ${filteredLocations.length} локации`}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#F0F2F2] rounded-2xl border border-[#E1E1E1]">
            <p className="text-sm text-[#0D0D0D]/70 font-medium">
              {dict.locations?.noLocations || "По выбранным критериям локаций не найдено."}
            </p>
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className="mt-3 text-xs font-bold text-[#07626A] hover:underline cursor-pointer"
            >
              {dict.locations?.resetFilters || "Сбросить фильтры"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
