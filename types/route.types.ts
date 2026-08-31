export type RouteDifficulty = "easy" | "medium" | "hard";
export type RouteRegion = "ala-archa" | "alamedin" | "chunkurchak";
export type RouteFilterRegion = "all" | RouteRegion;

export interface RoutePOI {
  id: string;
  name: {
    ru: string;
    kg: string;
    en: string;
  };
  type: "guesthouse" | "service" | "rescue" | "viewpoint";
  lat: number;
  lng: number;
}

export interface AssignedGuide {
  id?: string | number;
  name: string;
  role: {
    ru: string;
    kg: string;
    en: string;
  };
  image: string;
  phone: string;
  experienceYears: number;
  languages: string[];
  isVerified: boolean;
}

export interface RouteItem {
  id: string;
  region: RouteRegion;
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
  difficulty: RouteDifficulty;
  distanceKm: number;
  durationHours: number;
  hasFemaleGuide: boolean;
  elevationGainMeters: number;
  centerCoordinates: [number, number];
  coordinates: [number, number][];
  imageUrl?: string;
  assignedGuides?: AssignedGuide[];
  assignedGuide?: AssignedGuide;
  pois?: RoutePOI[];
}
