"use client";

import React from "react";
import { Sparkles, ShieldCheck, Compass, Users, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const CommunityCtaSection: React.FC = () => {
  const { dict } = useLanguage();

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#F7FAFA] border border-teal-100/80 p-8 sm:p-12 lg:p-16 shadow-xs">
          {/* Content Container */}
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-[#07626A] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#07626A]" />
              <span>{dict.cta.badge}</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold tracking-tight uppercase leading-[1.18] mb-4 text-gray-900 max-w-3xl">
              {dict.cta.title}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal mb-10 max-w-2xl">
              {dict.cta.description}
            </p>

            {/* Two Value / Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl mb-10 text-left">
              {/* For Travelers */}
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-teal-100 transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#07626A] flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
                    {dict.cta.roleTravelersTitle}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {dict.cta.roleTravelersDesc}
                </p>
              </div>

              {/* For Guides and Partners */}
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-teal-100 transition-all">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#07626A] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
                    {dict.cta.rolePartnersTitle}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {dict.cta.rolePartnersDesc}
                </p>
              </div>
            </div>

            {/* Bottom Feature Tags */}
            <div className="pt-6 border-t border-gray-200/70 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600 font-medium w-full max-w-3xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#07626A] shrink-0" />
                <span>{dict.cta.tagSafety}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#07626A] shrink-0" />
                <span>{dict.cta.tagRoutes}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#07626A] shrink-0" />
                <span>{dict.cta.tagGuides}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};




