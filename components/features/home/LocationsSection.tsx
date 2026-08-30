"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { INITIAL_LOCATIONS } from "@/data/locations.data";

export const LocationsSection: React.FC = () => {
  const { dict, language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 max-w-3xl">
          {/* Label / Badge */}
          <span
            className="block text-sm sm:text-[15px] font-bold uppercase tracking-wider mb-2.5"
            style={{ color: "#07626A" }}
          >
            {dict.locations.badge}
          </span>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-gray-900 tracking-tight uppercase mb-3 leading-tight">
            {dict.locations.title}
          </h2>

          {/* Subtitle */}
          <p className="text-[13.5px] sm:text-[15px] text-gray-600 leading-relaxed">
            {dict.locations.subtitle}
          </p>
        </div>

        {/* 3 Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {INITIAL_LOCATIONS.map((loc) => {
            const title = loc.title[language] || loc.title.ru;
            const desc = loc.desc[language] || loc.desc.ru;

            return (
              <Link
                key={loc.id}
                href={`/map?location=${loc.key}`}
                className="group relative h-[380px] sm:h-[420px] lg:h-[440px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-7 block"
              >
                {/* Background Image */}
                <Image
                  src={loc.imageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-50% to-transparent pointer-events-none" />

                {/* Card Content (Over Image) */}
                <div className="relative z-10 text-white">
                  <h3 className="text-lg sm:text-[19px] font-bold tracking-tight mb-2 text-white drop-shadow-xs">
                    {title}
                  </h3>

                  <p className="text-[12.5px] sm:text-[13.5px] text-gray-200/90 leading-relaxed mb-4 line-clamp-3">
                    {desc}
                  </p>

                  {/* Action Link */}
                  <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-white group-hover:text-teal-200 transition-colors">
                    <span>{dict.locations.viewOnMap}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

