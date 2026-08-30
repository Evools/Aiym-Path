"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Globe, Phone, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_GUIDES, GuideItem } from "@/data/guides.data";

export const GuidesPreviewSection: React.FC = () => {
  const { dict, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "guide" | "agency">("all");

  const filteredGuides = INITIAL_GUIDES.filter((guide: GuideItem) => {
    if (activeTab === "all") return true;
    return guide.category === activeTab;
  });

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-0.5 rounded-full bg-gray-200/80 text-gray-700 text-[11px] font-medium mb-3">
            {dict.guides.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase mb-2">
            {dict.guides.title}
          </h2>
          <p className="text-xs sm:text-[13px] text-gray-500 max-w-2xl">
            {dict.guides.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-teal-800 text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {dict.guides.tabs.all}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "guide"
                ? "bg-teal-800 text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {dict.guides.tabs.guide}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("agency")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "agency"
                ? "bg-teal-800 text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {dict.guides.tabs.agency}
          </button>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {filteredGuides.map((guide) => {
            const locTag = guide.locationTag[language] || guide.locationTag.ru;
            const langs = guide.languages[language] || guide.languages.ru;

            return (
              <div
                key={guide.id}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-teal-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Avatar + Verified Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-xs">
                      <Image
                        src={guide.avatarUrl}
                        alt={guide.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {guide.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {dict.guides.verifiedBadge}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                    {guide.name}
                  </h3>

                  {/* Location Tag */}
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px]">
                      {locTag}
                    </span>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{langs}</span>
                  </div>
                </div>

                {/* Phone Link */}
                <div className="pt-3 border-t border-gray-50">
                  <a
                    href={`tel:${guide.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{guide.phone}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA below cards */}
        <div className="flex justify-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{dict.guides.aboutProject}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
