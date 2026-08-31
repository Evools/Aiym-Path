"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  FileText,
  Mountain,
  Award,
  Languages,
  Users,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminGuideItem } from "@/lib/services/admin-storage.service";
import { GuideItem } from "@/data/guides.data";

export const GuideCard: React.FC<{ guide: AdminGuideItem | GuideItem }> = ({ guide }) => {
  const { dict, language } = useLanguage();
  const [activeSkill, setActiveSkill] = useState<"firstAid" | "mountaineer" | "mountainGuide">("firstAid");

  const skillsList = [
    {
      id: "firstAid" as const,
      title: dict.guides.skills.firstAid,
      icon: <FileText className="w-3.5 h-3.5 shrink-0" />,
      active: (guide as AdminGuideItem).skills?.firstAid ?? true,
    },
    {
      id: "mountaineer" as const,
      title: dict.guides.skills.mountaineer,
      icon: <Mountain className="w-3.5 h-3.5 shrink-0" />,
      active: (guide as AdminGuideItem).skills?.mountaineer ?? true,
    },
    {
      id: "mountainGuide" as const,
      title: dict.guides.skills.mountainGuide,
      icon: <Award className="w-3.5 h-3.5 shrink-0" />,
      active: (guide as AdminGuideItem).skills?.mountainGuide ?? true,
    },
  ].filter((s) => s.active);

  const guideRole =
    typeof (guide as AdminGuideItem).role === "object"
      ? (guide as AdminGuideItem).role[language as "ru" | "kg" | "en"] ||
        (guide as AdminGuideItem).role.ru
      : "";

  const guideLanguages =
    (guide as AdminGuideItem).languages && (guide as AdminGuideItem).languages.length > 0
      ? (guide as AdminGuideItem).languages.join(", ")
      : dict.guides.languages;

  const guideGroupSize =
    (guide as AdminGuideItem).groupSize || dict.guides.groupSize;

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] hover:shadow-md transition-shadow duration-200">
      {/* Guide Photo with Certified Badge */}
      <div className="relative w-full aspect-[16/9.5] bg-gray-100 overflow-hidden">
        <Image
          src={guide.image || "/images/guides/guide-2.jpg"}
          alt={guide.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
          className="object-cover object-center"
        />

        {/* Certified Badge Top Right */}
        {guide.isVerified && (
          <div
            className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[11px] font-medium shadow-xs"
            style={{ backgroundColor: "#07626A" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>{dict.guides.certified}</span>
          </div>
        )}
      </div>

      {/* Guide Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Pills */}
          {guide.locations && guide.locations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {guide.locations.map((loc, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[11px] font-medium text-gray-700"
                >
                  {loc}
                </span>
              ))}
            </div>
          )}

          {/* Guide Name */}
          <h3 className="text-base sm:text-[17px] font-bold text-gray-900 leading-snug">
            {guide.name}
          </h3>

          {/* Guide Role / Specialization */}
          {guideRole && (
            <p className="text-xs text-[#07626A] font-semibold mt-1 mb-3">
              {guideRole}
            </p>
          )}

          {/* Interactive Skills Row */}
          {skillsList.length > 0 && (
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
                    <span className="w-8 h-8 flex items-center justify-center shrink-0">
                      {skill.icon}
                    </span>

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
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-3" />

          {/* Languages */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2.5">
            <Languages className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span className="truncate">{guideLanguages}</span>
          </div>

          {/* Group Size Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF4F4] text-[#07626A] text-xs font-medium mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>{guideGroupSize}</span>
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
