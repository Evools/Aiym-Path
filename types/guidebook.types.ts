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

export interface ChecklistItem {
  id: string;
  category: "clothing" | "navigation" | "hygiene" | "safety";
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
}
