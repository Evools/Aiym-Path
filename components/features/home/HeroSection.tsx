"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const HeroSection: React.FC = () => {
  const { dict } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax offsets (slow gentle shifts on scroll)
  const girlShift = Math.min(scrollY * 0.12, 45); // Girl moves down slowly
  const bannerShift = Math.min(scrollY * 0.05, 25); // Background shifts down subtly
  const uzorShift = Math.min(scrollY * 0.08, 30); // Ornament shifts down subtly
  const effectLift = Math.min(scrollY * 0.1, 30); // Effect smoothly rises slightly upwards on scroll

  return (
    <section className="relative w-full min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] flex items-center pt-8 sm:pt-12 lg:pt-16 pb-20 bg-white">
      {/* Background Banner Image (/images/banner/banner.webp) with subtle parallax */}
      <div
        className="absolute inset-0 z-0 overflow-hidden will-change-transform transition-transform duration-75 ease-out"
        style={{
          transform: `scale(1.03) translateY(${bannerShift}px)`,
        }}
      >
        <Image
          src="/images/banner/banner.webp"
          alt="Aiym Path Banner Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Kyrgyz national ornament on the left (/images/banner/uzor.webp) with subtle downward shift */}
      <div
        className="absolute top-0 left-0 bottom-0 z-[5] w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[620px] pointer-events-none select-none overflow-hidden flex items-center justify-start will-change-transform transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${uzorShift}px)`,
        }}
      >
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

      {/* Girl traveler in the right corner (/images/banner/asia-girl.webp) - moves down slowly on scroll */}
      <div
        className="hidden md:flex absolute bottom-0 right-0 z-10 w-full max-w-[360px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[620px] xl:max-w-[700px] h-[75%] sm:h-[85%] lg:h-[92%] pointer-events-none select-none items-end justify-end will-change-transform transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${girlShift}px)`,
        }}
      >
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

      {/* Bottom Ragged Edge Effect (/images/banner/effect.webp) - 100% width, slightly lowered */}
      <div
        className="absolute -bottom-14 sm:-bottom-20 lg:-bottom-24 left-0 right-0 w-full z-30 pointer-events-none select-none will-change-transform transition-transform duration-75 ease-out flex flex-col"
        style={{
          transform: `translateY(-${effectLift}px)`,
        }}
      >
        <div className="relative w-full h-16 sm:h-24 lg:h-32">
          <Image
            src="/images/banner/effect.webp"
            alt="Torn edge effect"
            fill
            priority
            sizes="100vw"
            className="w-full object-cover object-top"
          />
        </div>
        {/* Seamless solid white filler below the torn edge */}
        <div className="w-full h-28 sm:h-36 bg-white" />
      </div>
    </section>
  );
};
