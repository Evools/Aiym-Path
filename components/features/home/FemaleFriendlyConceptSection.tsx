"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const FemaleFriendlyConceptSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text & List */}
          <div className="lg:col-span-7">
            <span className="inline-block px-3 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium mb-3">
              {dict.concept.badge}
            </span>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase leading-tight mb-4">
              ЧТО ЗНАЧИТ{" "}
              <span className="text-teal-700">FEMALE-FRIENDLY</span>
            </h2>

            <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-3">
              {dict.concept.intro}
            </p>

            <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-4">
              {dict.concept.kyrgyzstanContext}
            </p>

            <p className="text-xs sm:text-[13px] text-gray-700 font-medium leading-relaxed mb-3">
              {dict.concept.femaleFriendlyOffers}
            </p>

            <ul className="space-y-2">
              {dict.concept.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-emerald-700" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                alt="Cozy lodge in Kyrgyzstan mountains"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
