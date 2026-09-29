export interface SiteLogoData {
  type: "text" | "image" | "both";
  text: {
    ru: string;
    kg: string;
    en: string;
  };
  subtext: {
    ru: string;
    kg: string;
    en: string;
  };
  imageUrl: string;
  imageHeight: number;
  showSubtext: boolean;
}

export const DEFAULT_SITE_LOGO: SiteLogoData = {
  type: "text",
  text: {
    ru: "Aiym Path",
    kg: "Aiym Path",
    en: "Aiym Path",
  },
  subtext: {
    ru: "female-friendly туризм",
    kg: "female-friendly туризм",
    en: "female-friendly tourism",
  },
  imageUrl: "",
  imageHeight: 36,
  showSubtext: true,
};
