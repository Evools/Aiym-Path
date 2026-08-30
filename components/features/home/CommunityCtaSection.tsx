"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const CommunityCtaSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-teal-900 overflow-hidden px-8 py-10 sm:px-12 sm:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          {/* Subtle teal geometric pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 opacity-90 pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 max-w-2xl text-white">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase mb-2">
              {dict.cta.title}
            </h2>
            <p className="text-xs sm:text-[13px] text-teal-100/80 leading-relaxed font-normal">
              {dict.cta.description}
            </p>
          </div>

          {/* Right Button */}
          <div className="relative z-10 shrink-0">
            <Link
              href="#contacts"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-950 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>{dict.cta.button}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
