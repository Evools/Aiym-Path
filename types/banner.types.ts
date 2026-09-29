export interface HeroBannerData {
  badge?: {
    ru: string;
    kg: string;
    en: string;
  };
  titlePrefix: {
    ru: string;
    kg: string;
    en: string;
  };
  titleLine2: {
    ru: string;
    kg: string;
    en: string;
  };
  titleLine3: {
    ru: string;
    kg: string;
    en: string;
  };
  subtitle: {
    ru: string;
    kg: string;
    en: string;
  };
  ctaMap: {
    ru: string;
    kg: string;
    en: string;
  };
  ctaGuides: {
    ru: string;
    kg: string;
    en: string;
  };
  backgroundImage: string;
  ornamentImage: string;
  girlImage: string;
}

export const DEFAULT_HERO_BANNER: HeroBannerData = {
  badge: {
    ru: "Пилотный проект",
    kg: "Пилоттук долбоор",
    en: "Pilot Project",
  },
  titlePrefix: {
    ru: "AIYM PATH",
    kg: "AIYM PATH",
    en: "AIYM PATH",
  },
  titleLine2: {
    ru: "ПУТЕШЕСТВИЯ БЕЗ",
    kg: "ЧЕКСИЗ",
    en: "TRAVEL WITHOUT",
  },
  titleLine3: {
    ru: "ГРАНИЦ",
    kg: "САЯКАТТАР",
    en: "BOUNDARIES",
  },
  subtitle: {
    ru: "Мы создаем безопасную, доступную и вдохновляющую среду для женщин в путешествиях и туризме по Кыргызской Республике.",
    kg: "Биз Кыргыз Республикасындагы аялдар үчүн коопсуз, жеткиликтүү жана шыктандыруучу саякат чөйрөсүн түзөбүз.",
    en: "We create a safe, accessible, and inspiring environment for women traveling and exploring the Kyrgyz Republic.",
  },
  ctaMap: {
    ru: "Карта",
    kg: "Карта",
    en: "Map",
  },
  ctaGuides: {
    ru: "Гиды",
    kg: "Гиддер",
    en: "Guides",
  },
  backgroundImage: "/images/banner/banner.webp",
  ornamentImage: "/images/banner/uzor.webp",
  girlImage: "/images/banner/asia-girl.webp",
};
