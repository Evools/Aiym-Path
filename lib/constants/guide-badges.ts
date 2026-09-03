import React from "react";
import {
  HeartPulse,
  Mountain,
  Award,
  Compass,
  Tent,
  Camera,
  ShieldCheck,
  Trees,
  Footprints,
  Coffee,
  Car,
  Sparkles,
  Flame,
  Navigation,
  FileText,
  ShieldAlert,
  Sun,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react";

export interface PresetBadgeOption {
  id: string;
  icon: string;
  label: {
    ru: string;
    kg: string;
    en: string;
  };
}

export const PRESET_GUIDE_BADGES: PresetBadgeOption[] = [
  {
    id: "firstAid",
    icon: "HeartPulse",
    label: {
      ru: "Первая медицинская помощь (WFR)",
      kg: "Биринчи медициналык жардам",
      en: "Wilderness First Aid (WFR)",
    },
  },
  {
    id: "mountainGuide",
    icon: "Mountain",
    label: {
      ru: "Горный гид (KMGA/IFMGA)",
      kg: "Тоо гиди",
      en: "Certified Mountain Guide",
    },
  },
  {
    id: "mountaineer",
    icon: "Award",
    label: {
      ru: "Альпинизм и скалолазание",
      kg: "Альпинизм жана аскага чыгуу",
      en: "Alpinism & Rock Climbing",
    },
  },
  {
    id: "femaleSafe",
    icon: "ShieldCheck",
    label: {
      ru: "Стандарт Female-Friendly & Сопровождение",
      kg: "Аялдар үчүн коопсуз коштоо",
      en: "Female-Friendly & Safety Lead",
    },
  },
  {
    id: "navigation",
    icon: "Compass",
    label: {
      ru: "GPS-навигация и картография",
      kg: "GPS-навигация",
      en: "Navigation & Topography",
    },
  },
  {
    id: "photoDrone",
    icon: "Camera",
    label: {
      ru: "Фотосопровождение и дрон",
      kg: "Сүрөт жана дрон тартуу",
      en: "Photo & Drone Tours",
    },
  },
  {
    id: "campingSurvival",
    icon: "Tent",
    label: {
      ru: "Кемпинг и полевая кухня",
      kg: "Кемпинг жана талаа ашканасы",
      en: "Camping & Outdoor Kitchen",
    },
  },
  {
    id: "horseTrekking",
    icon: "Footprints",
    label: {
      ru: "Конные переходы",
      kg: "Ат менен жүрүү",
      en: "Horseback Trekking",
    },
  },
  {
    id: "ecoTourism",
    icon: "Trees",
    label: {
      ru: "Экотуризм и флора Тянь-Шаня",
      kg: "Экотуризм жана жаратылыш",
      en: "Eco-tourism & Flora",
    },
  },
  {
    id: "ethnoCulture",
    icon: "Coffee",
    label: {
      ru: "Этнография и обычаи",
      kg: "Этнография жана салттар",
      en: "Ethno-tours & Nomad Culture",
    },
  },
  {
    id: "offroad4x4",
    icon: "Car",
    label: {
      ru: "4x4 Внедорожные экспедиции",
      kg: "4x4 Жол тандабас экспедициялар",
      en: "4x4 Off-road Expeditions",
    },
  },
  {
    id: "vipCustom",
    icon: "Sparkles",
    label: {
      ru: "Индивидуальные VIP-маршруты",
      kg: "Жекече VIP каттамдар",
      en: "Bespoke & Private Tours",
    },
  },
];

export const AVAILABLE_BADGE_ICONS = [
  { name: "HeartPulse", label: "Медицина / Аптечка" },
  { name: "Mountain", label: "Горы / Вершины" },
  { name: "Award", label: "Сертификат / Награда" },
  { name: "ShieldCheck", label: "Безопасность / Защита" },
  { name: "Compass", label: "Навигация / Компас" },
  { name: "Camera", label: "Фото / Съемка" },
  { name: "Tent", label: "Кемпинг / Палатки" },
  { name: "Footprints", label: "Пешком / Конные" },
  { name: "Trees", label: "Экология / Лес" },
  { name: "Coffee", label: "Этно / Традиции" },
  { name: "Car", label: "Авто / 4x4" },
  { name: "Sparkles", label: "VIP / Звезды" },
  { name: "Flame", label: "Костер / Выживание" },
  { name: "Sun", label: "Лето / Озеро" },
  { name: "FileText", label: "Лицензия / Документы" },
  { name: "Navigation", label: "Маршрут / Трек" },
];

export function getBadgeIconComponent(iconName: string, className = "w-3.5 h-3.5") {
  switch (iconName) {
    case "HeartPulse":
      return React.createElement(HeartPulse, { className });
    case "Mountain":
      return React.createElement(Mountain, { className });
    case "Award":
      return React.createElement(Award, { className });
    case "ShieldCheck":
      return React.createElement(ShieldCheck, { className });
    case "Compass":
      return React.createElement(Compass, { className });
    case "Camera":
      return React.createElement(Camera, { className });
    case "Tent":
      return React.createElement(Tent, { className });
    case "Footprints":
      return React.createElement(Footprints, { className });
    case "Trees":
      return React.createElement(Trees, { className });
    case "Coffee":
      return React.createElement(Coffee, { className });
    case "Car":
      return React.createElement(Car, { className });
    case "Sparkles":
      return React.createElement(Sparkles, { className });
    case "Flame":
      return React.createElement(Flame, { className });
    case "Sun":
      return React.createElement(Sun, { className });
    case "Navigation":
      return React.createElement(Navigation, { className });
    case "FileText":
      return React.createElement(FileText, { className });
    case "ShieldAlert":
      return React.createElement(ShieldAlert, { className });
    case "Users":
      return React.createElement(Users, { className });
    default:
      return React.createElement(CheckCircle2, { className });
  }
}
