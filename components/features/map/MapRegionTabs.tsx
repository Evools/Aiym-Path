"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { RouteFilterRegion, RouteItem } from "@/types/route.types";
import { useLanguage } from "@/context/LanguageContext";
import {
  AdminStorageService,
  AdminRegionItem,
} from "@/lib/services/admin-storage.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MapRegionTabsProps {
  selectedRegion: RouteFilterRegion;
  onSelectRegion: (region: RouteFilterRegion) => void;
  routes?: RouteItem[];
}

export const MapRegionTabs: React.FC<MapRegionTabsProps> = ({
  selectedRegion,
  onSelectRegion,
  routes = [],
}) => {
  const { language } = useLanguage();
  const [allRegions, setAllRegions] = useState<AdminRegionItem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setAllRegions(AdminStorageService.getRegions());
  }, []);

  // Filter only regions that actually have routes
  const activeRegions = useMemo(() => {
    if (!routes || routes.length === 0) return allRegions;
    return allRegions.filter((reg) =>
      routes.some((route) => route.region === reg.id)
    );
  }, [allRegions, routes]);

  const allTabLabel = {
    ru: "Все регионы",
    kg: "Бардык аймактар",
    en: "All Regions",
  };

  const totalRoutesCount = routes.length;

  // Check scroll position to show/hide navigation arrows
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, activeRegions]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -240 : 240;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Scroll active tab into view smoothly
  const handleTabClick = (regionId: RouteFilterRegion, targetEl: HTMLButtonElement) => {
    onSelectRegion(regionId);
    if (targetEl && scrollContainerRef.current) {
      targetEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <div className="relative w-full flex items-center group">
      {/* Left Scroll Arrow */}
      {canScrollLeft && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center h-full pr-4 bg-gradient-to-r from-white via-white to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="w-8 h-8 rounded-full bg-white border border-[#E1E1E1] shadow-md hover:border-[#07626A] text-[#0D0D0D] flex items-center justify-center pointer-events-auto transition-all cursor-pointer hover:scale-105"
            aria-label="Прокрутить влево"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal Tabs Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth select-none"
      >
        <div className="inline-flex p-1.5 rounded-2xl bg-[#F0F2F2] border border-[#E1E1E1] flex-nowrap shrink-0 gap-1">
          {/* "All" Tab */}
          <button
            type="button"
            onClick={(e) => handleTabClick("all", e.currentTarget)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shrink-0 flex items-center gap-1.5 ${
              selectedRegion === "all"
                ? "bg-[#07626A] text-white shadow-xs"
                : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
            }`}
          >
            <span>{allTabLabel[language] || allTabLabel.ru}</span>
            {totalRoutesCount > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
                  selectedRegion === "all"
                    ? "bg-white/20 text-white"
                    : "bg-black/5 text-[#0D0D0D]/60"
                }`}
              >
                {totalRoutesCount}
              </span>
            )}
          </button>

          {/* Dynamic Region Tabs */}
          {activeRegions.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            const title = reg.label[language] || reg.label.ru;
            const regionRoutesCount = routes.filter((r) => r.region === reg.id).length;

            return (
              <button
                key={reg.id}
                type="button"
                onClick={(e) => handleTabClick(reg.id, e.currentTarget)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#07626A] text-white shadow-xs"
                    : "text-[#0D0D0D]/75 hover:text-[#07626A] hover:bg-white/60"
                }`}
              >
                <span>{title}</span>
                {regionRoutesCount > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-black/5 text-[#0D0D0D]/60"
                    }`}
                  >
                    {regionRoutesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Scroll Arrow */}
      {canScrollRight && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center h-full pl-4 bg-gradient-to-l from-white via-white to-transparent pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="w-8 h-8 rounded-full bg-white border border-[#E1E1E1] shadow-md hover:border-[#07626A] text-[#0D0D0D] flex items-center justify-center pointer-events-auto transition-all cursor-pointer hover:scale-105"
            aria-label="Прокрутить вправо"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
