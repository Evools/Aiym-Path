"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Mountain,
  Award,
  Languages,
  Users,
  Phone,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface GuideData {
  id: number;
  name: string;
  image: string;
  locations: string[];
  phone: string;
}

const GuideCard: React.FC<{ guide: GuideData }> = ({ guide }) => {
  const { dict } = useLanguage();
  const [activeSkill, setActiveSkill] = useState<"firstAid" | "mountaineer" | "mountainGuide">("firstAid");

  const skillsList = [
    {
      id: "firstAid" as const,
      title: dict.guides.skills.firstAid,
      icon: <FileText className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: "mountaineer" as const,
      title: dict.guides.skills.mountaineer,
      icon: <Mountain className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: "mountainGuide" as const,
      title: dict.guides.skills.mountainGuide,
      icon: <Award className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E5E7EB]">
      {/* Guide Photo with Certified Badge */}
      <div className="relative w-full aspect-[16/9.5] bg-amber-50/30 overflow-hidden">
        <Image
          src={guide.image}
          alt={guide.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
          className="object-cover object-center"
        />

        {/* Certified Badge Top Right */}
        <div
          className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[11px] font-medium shadow-xs"
          style={{ backgroundColor: "#07626A" }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span>{dict.guides.certified}</span>
        </div>
      </div>

      {/* Guide Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Pills */}
          <div className="flex flex-wrap gap-2 mb-3.5">
            {guide.locations.map((loc, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#F3F4F6] text-[11px] font-medium text-gray-700"
              >
                {loc}
              </span>
            ))}
          </div>

          {/* Guide Name */}
          <h3 className="text-base sm:text-[17px] font-bold text-gray-900 mb-3.5 leading-snug">
            {guide.name}
          </h3>

          {/* Interactive Skills Row - Rock-solid icon positioning with smooth text expansion */}
          <div className="flex items-center gap-2 mb-3.5 h-8">
            {skillsList.map((skill) => {
              const isActive = activeSkill === skill.id;

              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setActiveSkill(skill.id)}
                  title={skill.title}
                  className={`h-8 rounded-lg bg-[#EAF4F4] text-[#07626A] inline-flex items-center cursor-pointer transition-colors duration-200 overflow-hidden select-none ${
                    isActive ? "hover:bg-[#EAF4F4]" : "hover:bg-[#DCEDED]"
                  }`}
                >
                  {/* Icon is permanently locked to 32x32px and never moves */}
                  <span className="w-8 h-8 flex items-center justify-center shrink-0">
                    {skill.icon}
                  </span>

                  {/* Smooth horizontal label slide-out */}
                  <div
                    className={`grid transition-[grid-template-columns,opacity,padding] duration-300 ease-out ${
                      isActive
                        ? "grid-cols-[1fr] opacity-100 pr-3"
                        : "grid-cols-[0fr] opacity-0 pr-0"
                    }`}
                  >
                    <span className="overflow-hidden whitespace-nowrap text-xs font-medium">
                      {skill.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-3" />

          {/* Languages */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2.5">
            <Languages className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>{dict.guides.languages}</span>
          </div>

          {/* Group Size Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF4F4] text-[#07626A] text-xs font-medium mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>{dict.guides.groupSize}</span>
          </div>
        </div>

        {/* Phone Call Link */}
        <div>
          <a
            href={`tel:${guide.phone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#07626A] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gray-800" />
            <span>{guide.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const GuidesPreviewSection: React.FC = () => {
  const { dict } = useLanguage();

  const guides: GuideData[] = [
    {
      id: 1,
      name: "Руслан Маматкулов",
      image: "/images/guides/guide-1.webp",
      locations: ["Бишкек", "Каракол", "Нарын"],
      phone: "+996 700 000 002",
    },
    {
      id: 2,
      name: "Руслан Маматкулов",
      image: "/images/guides/guide-1.webp",
      locations: ["Бишкек", "Каракол", "Нарын"],
      phone: "+996 700 000 002",
    },
    {
      id: 3,
      name: "Руслан Маматкулов",
      image: "/images/guides/guide-1.webp",
      locations: ["Бишкек", "Каракол", "Нарын"],
      phone: "+996 700 000 002",
    },
  ];

  return (
    <section id="guides" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header (Centered) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Label: Наши люди */}
          <span
            className="block text-[20px] font-normal mb-2"
            style={{
              color: "#07626A",
              fontFamily: "Inter, var(--font-geist-sans), sans-serif",
              lineHeight: "normal",
            }}
          >
            {dict.guides.badge}
          </span>

          {/* Main Title: ГИДЫ ТУРАГЕНТЫ */}
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-3">
            <span className="text-gray-900">{dict.guides.titlePrefix} </span>
            <span style={{ color: "#07626A" }}>{dict.guides.titleHighlight}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto font-normal">
            {dict.guides.subtitle}
          </p>
        </div>

        {/* 3 Guide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        {/* Bottom CTA Button: Посмотреть весь список -> /tours */}
        <div className="flex justify-center mt-12">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#EAF4F4] hover:bg-[#D9EFEF] text-[#07626A] text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <span>{dict.guides.viewAllList}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
