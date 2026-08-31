export type RouteDifficulty = "easy" | "medium" | "hard";
export type RouteRegion = "all" | "ala-archa" | "alamedin" | "chunkurchak";

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

export interface RouteItem {
  id: string;
  region: "ala-archa" | "alamedin" | "chunkurchak";
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
  pois?: RoutePOI[];
}
