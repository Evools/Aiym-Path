export type GuidebookAudience = "travelers" | "providers";

export type GuidebookCategory =
  | "safety"
  | "female_tips"
  | "trekking"
  | "eco_culture"
  | "planning"
  | "emergency"
  | "hospitality"
  | "standards"
  | "gender"
  | "infrastructure";

export interface GuidebookItem {
  id: string;
  audience: GuidebookAudience;
  category: GuidebookCategory;
  iconName:
    | "ShieldCheck"
    | "UserCheck"
    | "Compass"
    | "Sprout"
    | "Route"
    | "PhoneCall"
    | "Sparkles"
    | "Lock"
    | "Award"
    | "Users"
    | "Radio";
  title: {
    ru: string;
    kg: string;
    en: string;
  };
  shortDescription: {
    ru: string;
    kg: string;
    en: string;
  };
  details: {
    ru: string[];
    kg: string[];
    en: string[];
  };
  badgeText?: {
    ru: string;
    kg: string;
    en: string;
  };
  actionType?: "emergency_call" | "checklist" | "modal";
}

export type EquipmentCategory = "clothing" | "navigation" | "hygiene" | "safety" | "shelter";

export interface ChecklistItem {
  id: string;
  category: EquipmentCategory;
  label: {
    ru: string;
    kg: string;
    en: string;
  };
  note?: {
    ru: string;
    kg: string;
    en: string;
  };
  isEssential: boolean;
  locationIds?: string[]; // IDs of specific locations/regions or undefined for universal items
  difficulty?: "easy" | "medium" | "hard" | "expert" | "all";
  iconName?: string;
}

export interface DifficultyLevelGuide {
  id: "easy" | "medium" | "hard" | "expert";
  badge: {
    ru: string;
    kg: string;
    en: string;
  };
  title: {
    ru: string;
    kg: string;
    en: string;
  };
  duration: {
    ru: string;
    kg: string;
    en: string;
  };
  elevation: {
    ru: string;
    kg: string;
    en: string;
  };
  description: {
    ru: string;
    kg: string;
    en: string;
  };
  requiredGear: {
    ru: string[];
    kg: string[];
    en: string[];
  };
  suitableFor: {
    ru: string;
    kg: string;
    en: string;
  };
}

export interface PdfResourceItem {
  id: string;
  title: {
    ru: string;
    kg: string;
    en: string;
  };
  description: {
    ru: string;
    kg: string;
    en: string;
  };
  fileSize: string; // e.g. "PDF • 2.4 MB"
  badge: {
    ru: string;
    kg: string;
    en: string;
  };
  fileUrl: string; // Google Drive share link, direct PDF URL, or cloud storage link
}
