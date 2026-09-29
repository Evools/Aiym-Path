export type LocationDifficulty = "easy" | "medium" | "hard";
export type LocationRegion =
  | "chuy"
  | "issyk-kul"
  | "naryn"
  | "osh"
  | "jalal-abad"
  | "talas"
  | "batken"
  | string;

export interface ProjectLocation {
  id: string;
  key?: string;
  region: LocationRegion;
  title: {
    ru: string;
    kg: string;
    en: string;
  };
  desc: {
    ru: string;
    kg: string;
    en: string;
  };
  imageUrl: string;
  difficulty: LocationDifficulty;
  distanceKm: number;
  elevationGainMeters: number;
  hasFemaleGuide?: boolean;
  hasEmergencyPoints?: boolean;
}

