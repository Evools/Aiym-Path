"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export const FemaleFriendlyConceptSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Text & Bullet Points */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Category / Badge */}
            <span
              className="block text-sm sm:text-[15px] font-bold uppercase tracking-wider mb-3.5"
              style={{ color: "#07626A" }}
            >
              {dict.concept.badge}
            </span>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-gray-900 tracking-tight uppercase leading-[1.15] mb-6">
              <span className="block">{dict.concept.titleLine1}</span>
              <span className="inline-flex items-center gap-2 mt-1" style={{ color: "#07626A" }}>
                {/* Decorative Spark Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#07626A] shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M16 6L6 2M18 12L4 12M16 18L6 22"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{dict.concept.titleLine2}</span>
              </span>
            </h2>

            {/* Paragraph 1 */}
            <p className="text-[13.5px] sm:text-[14.5px] text-gray-600 leading-relaxed mb-4">
              {dict.concept.intro}
            </p>

            {/* Paragraph 2 */}
            <p className="text-[13.5px] sm:text-[14.5px] text-gray-600 leading-relaxed mb-5">
              {dict.concept.kyrgyzstanContext}
            </p>

            {/* Paragraph 3 (Intro to points) */}
            <p className="text-[13.5px] sm:text-[14.5px] text-gray-800 font-semibold leading-relaxed mb-3.5">
              {dict.concept.femaleFriendlyOffers}
            </p>

            {/* Bullet Points List */}
            <ul className="space-y-2.5">
              {dict.concept.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[13.5px] sm:text-[14.5px] text-gray-700 font-medium leading-snug">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: "#07626A" }}
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] sm:aspect-[4/3] lg:aspect-[1/1] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
              <Image
                src="/images/concept/lodge.jpg"
                alt="Cozy mountain lodge in Kyrgyzstan"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

