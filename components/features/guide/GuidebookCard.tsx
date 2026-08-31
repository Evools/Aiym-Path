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
} from "lucide-react";
import { GuidebookItem } from "@/types/guidebook.types";
import { useLanguage } from "@/context/LanguageContext";

interface GuidebookCardProps {
  item: GuidebookItem;
  onSelect: (item: GuidebookItem) => void;
}

export const GuidebookCard: React.FC<GuidebookCardProps> = ({ item, onSelect }) => {
  const { language } = useLanguage();

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

  return (
    <div
      onClick={() => onSelect(item)}
      className="flex flex-col items-start gap-[10px] p-[24px_32px] self-stretch justify-self-stretch rounded-2xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors duration-150 cursor-pointer text-left"
    >
      {/* Icon Box */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-1"
        style={{ backgroundColor: "rgba(7, 98, 106, 0.10)" }}
      >
        {renderIcon(item.iconName)}
      </div>

      {/* Card Title */}
      <h3 className="text-base sm:text-lg font-bold text-[#0D0D0D] leading-snug">
        {title}
      </h3>

      {/* Card Description */}
      <p className="text-sm text-[#0D0D0D]/75 leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
};
