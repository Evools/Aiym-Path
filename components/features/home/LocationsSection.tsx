"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_LOCATIONS } from "@/data/locations.data";

export const LocationsSection: React.FC = () => {
  const { dict, language } = useLanguage();

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 max-w-3xl">
          <span className="inline-block px-3 py-0.5 rounded-full bg-gray-200/80 text-gray-700 text-[11px] font-medium mb-3">
            {dict.locations.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase mb-2">
            {dict.locations.title}
          </h2>
          <p className="text-xs sm:text-[13px] text-gray-500">
            {dict.locations.subtitle}
          </p>
        </div>

        {/* 3 Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INITIAL_LOCATIONS.map((loc) => {
            const title = loc.title[language] || loc.title.ru;
            const desc = loc.desc[language] || loc.desc.ru;

            return (
              <div
                key={loc.id}
                className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={loc.imageUrl}
                      alt={title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Bottom link */}
                <div className="px-5 pb-5 pt-0">
                  <Link
                    href={`/map?location=${loc.key}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors"
                  >
                    <span>{dict.locations.viewOnMap}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
