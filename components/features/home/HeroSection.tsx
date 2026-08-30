"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const HeroSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="relative w-full min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] flex items-center pt-8 sm:pt-12 lg:pt-16 pb-20 bg-white">
      {/* Background Banner Image (/images/banner/banner.webp) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/banner/banner.webp"
          alt="Aiym Path Banner Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Kyrgyz national ornament on the left (/images/banner/uzor.webp) */}
      <div className="absolute top-0 left-0 bottom-0 z-[5] w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[620px] pointer-events-none select-none overflow-hidden flex items-center justify-start">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/uzor.webp"
            alt="Кыргызский национальный узор"
            fill
            priority
            className="object-contain object-left"
          />
        </div>
      </div>

      {/* Girl traveler in the right corner (/images/banner/asia-girl.webp) - hidden on mobile, shown on md+ */}
      <div className="hidden md:flex absolute bottom-0 right-0 z-10 w-full max-w-[360px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[620px] xl:max-w-[700px] h-[75%] sm:h-[85%] lg:h-[92%] pointer-events-none select-none items-end justify-end">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/asia-girl.webp"
            alt="Кыргызская девушка-путешественница"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          {/* Pilot Project Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/90 backdrop-blur-xs border border-teal-200/70 text-teal-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{dict.hero.badge}</span>
          </div>

          {/* Large Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08] mb-5 uppercase">
            <span className="block text-gray-900">{dict.hero.titlePrefix}</span>
            <span className="block" style={{ color: "#07626A" }}>
              {dict.hero.titleLine2}
            </span>
            <span className="block" style={{ color: "#07626A" }}>
              {dict.hero.titleLine3}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed mb-8 max-w-lg">
            {dict.hero.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              style={{ backgroundColor: "#07626A" }}
            >
              <span>{dict.hero.ctaAbout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#contacts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <span>{dict.hero.ctaContact}</span>
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Ragged Edge Effect (/images/banner/effect.webp) - on top of banner and girl */}
      <div className="absolute -bottom-1 sm:bottom-0 left-0 right-0 w-full h-20 sm:h-28 lg:h-36 z-30 pointer-events-none select-none">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner/effect.webp"
            alt="Torn edge effect"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
};
