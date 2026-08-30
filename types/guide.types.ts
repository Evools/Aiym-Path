export type GuideBadgeType = "female_guide" | "verified" | "eco_certified";

export interface Guide {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  avatarUrl: string;
  isFemale: boolean;
  isVerified: boolean;
  languages: {
    ru: string[];
    kg: string[];
    en: string[];
  };
  experienceYears: number;
  rating: number;
  routesCount: number;
  bio?: {
    ru: string;
    kg: string;
    en: string;
  };
}
