"use client";

import React from "react";
import { Scale, Users, Map } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const AboutMissionSection: React.FC = () => {
  const { dict } = useLanguage();

  const cards = [
    {
      icon: <Scale className="w-5 h-5 text-teal-700" />,
      title: dict.about.cards.genderBalance.title,
      description: dict.about.cards.genderBalance.description,
    },
    {
      icon: <Users className="w-5 h-5 text-teal-700" />,
      title: dict.about.cards.womenEmpowerment.title,
      description: dict.about.cards.womenEmpowerment.description,
    },
    {
      icon: <Map className="w-5 h-5 text-teal-700" />,
      title: dict.about.cards.routeMapping.title,
      description: dict.about.cards.routeMapping.description,
    },
  ];

  return (
    <section id="about" className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 max-w-4xl">
          <span className="inline-block px-3 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium mb-3">
            {dict.about.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase mb-3">
            {dict.about.title}
          </h2>
          <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed max-w-3xl">
            {dict.about.description}
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-teal-200 hover:shadow-md transition-all duration-200 flex flex-col justify-start"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
