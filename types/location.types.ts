export interface ProjectLocation {
  id: string;
  key: "alaArcha" | "alamedin" | "chunkurchak";
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
  difficulty: "easy" | "medium" | "hard";
  distanceKm: number;
  elevationGainMeters: number;
  hasFemaleGuide: boolean;
  hasEmergencyPoints: boolean;
}
