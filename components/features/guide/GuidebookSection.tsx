"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, HelpCircle } from "lucide-react";
import { GuidebookAudience, GuidebookItem } from "@/types/guidebook.types";
import { GUIDEBOOK_ITEMS } from "@/data/guidebook.data";
import { AdminStorageService } from "@/lib/services/admin-storage.service";
import { useLanguage } from "@/context/LanguageContext";
import { GuidebookTabs } from "./GuidebookTabs";
import { GuidebookCard } from "./GuidebookCard";
import { GuideDetailModal } from "./GuideDetailModal";

export const GuidebookSection: React.FC = () => {
  const { language, dict } = useLanguage();
  const [items, setItems] = useState<GuidebookItem[]>(GUIDEBOOK_ITEMS);
  const [activeAudience, setActiveAudience] = useState<GuidebookAudience>("travelers");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<GuidebookItem | null>(null);

  useEffect(() => {
    async function loadItems() {
      const dbItems = await AdminStorageService.getGuidebookItems();
      if (dbItems && dbItems.length > 0) {
        setItems(dbItems);
      }
    }
    loadItems();
  }, []);

  const travelersItems = useMemo(
    () => items.filter((item) => item.audience === "travelers"),
    [items]
  );

  const providersItems = useMemo(
    () => items.filter((item) => item.audience === "providers"),
    [items]
  );

  const currentAudienceItems = activeAudience === "travelers" ? travelersItems : providersItems;

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return currentAudienceItems;
    const q = searchQuery.toLowerCase();
    return currentAudienceItems.filter((item) => {
      const title = (item.title[language] || item.title.ru).toLowerCase();
      const desc = (item.shortDescription[language] || item.shortDescription.ru).toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [currentAudienceItems, searchQuery, language]);

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Top Description & Tab Switcher Controls */}
        <div className="mb-10 sm:mb-12">
          {/* Subtitle text matching user screenshot */}
          <div className="max-w-2xl mb-8">
            <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed font-normal">
              {dict.guidebook?.introDescription ||
                "Рекомендации собраны отдельно для путешественниц и для поставщиков туристических услуг. Контент обновляется командой проекта через административную панель."}
            </p>
          </div>

          {/* Controls Bar: Tabs and Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <GuidebookTabs
              activeAudience={activeAudience}
              onChangeAudience={setActiveAudience}
              travelersCount={travelersItems.length}
              providersCount={providersItems.length}
            />

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.guidebook?.searchPlaceholder || "Поиск рекомендаций..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#07626A] focus:ring-1 focus:ring-[#07626A] transition-all"
              />
            </div>
          </div>
        </div>

        {/* 6 Recommendations Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {filteredItems.map((item) => (
              <GuidebookCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-gray-50 border border-gray-100">
            <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Ничего не найдено
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Попробуйте изменить поисковый запрос или переключить категорию.
            </p>
          </div>
        )}
      </div>

      {/* Expanded Details Modal */}
      <GuideDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};
