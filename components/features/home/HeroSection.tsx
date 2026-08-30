"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const HeroSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Banner container with rounded corners */}
        <div className="relative min-h-[480px] sm:min-h-[520px] rounded-3xl overflow-hidden shadow-sm flex items-center">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
              alt="Кыргызстан Ала-Арча"
              fill
              priority
              className="object-cover object-right sm:object-center"
            />
            {/* Dark left-to-right gradient overlay matching Figma */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-950/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-200 text-xs font-medium mb-6">
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>{dict.hero.badge}</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-5 uppercase">
              <span className="block text-teal-300">{dict.hero.titlePrefix}</span>
              {dict.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-normal mb-8 max-w-md">
              {dict.hero.subtitle}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#about"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>{dict.hero.ctaAbout}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold transition-colors"
              >
                <span>{dict.hero.ctaMap}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
