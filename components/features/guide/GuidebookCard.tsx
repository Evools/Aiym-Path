"use client";

import React from "react";
import {
  ShieldCheck,
  UserCheck,
  Compass,
  Sprout,
  Route,
  PhoneCall,
  Sparkles,
  Lock,
  Award,
  Users,
  Radio,
  ArrowRight,
} from "lucide-react";
import { GuidebookItem } from "@/types/guidebook.types";
import { useLanguage } from "@/context/LanguageContext";

interface GuidebookCardProps {
  item: GuidebookItem;
  onSelect: (item: GuidebookItem) => void;
}

export const GuidebookCard: React.FC<GuidebookCardProps> = ({ item, onSelect }) => {
  const { language, dict } = useLanguage();

  const renderIcon = (iconName: GuidebookItem["iconName"]) => {
    const iconClass = "w-5 h-5 text-[#07626A]";
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className={iconClass} />;
      case "UserCheck":
        return <UserCheck className={iconClass} />;
      case "Compass":
        return <Compass className={iconClass} />;
      case "Sprout":
        return <Sprout className={iconClass} />;
      case "Route":
        return <Route className={iconClass} />;
      case "PhoneCall":
        return <PhoneCall className={iconClass} />;
      case "Sparkles":
        return <Sparkles className={iconClass} />;
      case "Lock":
        return <Lock className={iconClass} />;
      case "Award":
        return <Award className={iconClass} />;
      case "Users":
        return <Users className={iconClass} />;
      case "Radio":
        return <Radio className={iconClass} />;
      default:
        return <ShieldCheck className={iconClass} />;
    }
  };

  const title = item.title[language] || item.title.ru;
  const description = item.shortDescription[language] || item.shortDescription.ru;
  const badge = item.badgeText ? item.badgeText[language] || item.badgeText.ru : null;

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-lg hover:border-teal-300/60 transition-all duration-200 cursor-pointer text-left"
    >
      <div>
        {/* Top Header: Icon & Optional Badge */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF4F4] flex items-center justify-center shrink-0 border border-teal-100/60 group-hover:scale-105 group-hover:bg-teal-100/70 transition-transform duration-200">
            {renderIcon(item.iconName)}
          </div>

          {badge && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-gray-100 text-gray-700 group-hover:bg-teal-50 group-hover:text-[#07626A] transition-colors">
              {badge}
            </span>
          )}
        </div>

        {/* Card Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#07626A] transition-colors">
          {title}
        </h3>

        {/* Card Description */}
        <p className="text-sm text-gray-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Action Footer Link */}
      <div className="pt-5 mt-5 border-t border-gray-100/80 flex items-center justify-between text-xs font-semibold text-[#07626A]">
        <span>{dict.guidebook?.readMore || "Подробнее"}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </div>
  );
};
