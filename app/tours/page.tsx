"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GuidesPreviewSection } from "@/components/features/home/GuidesPreviewSection";

export default function ToursPage() {
  const { dict } = useLanguage();

  return (
    <div className="w-full bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#07626A] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{dict.nav.home}</span>
        </Link>

        <div className="border-b border-gray-100 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#07626A] text-xs font-semibold uppercase mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{dict.nav.tours}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {dict.nav.tours}
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            {dict.guides.subtitle}
          </p>
        </div>
      </div>

      <GuidesPreviewSection />
    </div>
  );
}
