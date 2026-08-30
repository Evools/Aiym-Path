"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Users, Map } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const AboutMissionSection: React.FC = () => {
  const { dict } = useLanguage();

  const cards = [
    {
      id: "genderBalance",
      image: "/images/about/1.webp",
      icon: <ShieldCheck className="w-5 h-5 text-[#07626A]" strokeWidth={1.75} />,
      title: dict.about.cards.genderBalance.title,
      description: dict.about.cards.genderBalance.description,
    },
    {
      id: "womenEmpowerment",
      image: "/images/about/2.webp",
      icon: <Users className="w-5 h-5 text-[#07626A]" strokeWidth={1.75} />,
      title: dict.about.cards.womenEmpowerment.title,
      description: dict.about.cards.womenEmpowerment.description,
    },
    {
      id: "routeMapping",
      image: "/images/about/3.webp",
      icon: <Map className="w-5 h-5 text-[#07626A]" strokeWidth={1.75} />,
      title: dict.about.cards.routeMapping.title,
      description: dict.about.cards.routeMapping.description,
    },
  ];

  return (
    <section id="about" className="relative z-10 pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 max-w-4xl">
          {/* Label: О нас */}
          <span
            className="block text-[20px] font-normal mb-3"
            style={{
              color: "#07626A",
              fontFamily: "Inter, var(--font-geist-sans), sans-serif",
              lineHeight: "normal",
            }}
          >
            {dict.about.badge}
          </span>

          {/* Title: Почему появился Aiym Path */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight uppercase mb-4 leading-tight">
            {dict.about.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {dict.about.description}
          </p>
        </div>

        {/* 3 Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E5E7EB]"
            >
              {/* Card Text Content */}
              <div className="p-6 sm:p-7">
                {/* Icon Container */}
                <div className="w-11 h-11 rounded-xl bg-[#EAF4F4] flex items-center justify-center mb-5">
                  {card.icon}
                </div>

                {/* Card Title */}
                <h3 className="text-base sm:text-[17px] font-bold text-gray-900 mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-[13px] text-[#6B7280] font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Card Bottom Image */}
              <div className="relative w-full h-[180px] overflow-hidden mt-auto">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                  className="object-cover object-bottom"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
