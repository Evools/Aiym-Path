export interface GuideItem {
  id: string;
  name: string;
  category: "guide" | "agency";
  categoryLabel: {
    ru: string;
    kg: string;
    en: string;
  };
  locationTag: {
    ru: string;
    kg: string;
    en: string;
  };
  phone: string;
  avatarUrl: string;
  isFemale: boolean;
  isVerified: boolean;
  languages: {
    ru: string;
    kg: string;
    en: string;
  };
}

export const INITIAL_GUIDES: GuideItem[] = [
  {
    id: "guide-1",
    name: "Руслан Маматуков",
    category: "guide",
    categoryLabel: {
      ru: "Гид",
      kg: "Гид",
      en: "Guide",
    },
    locationTag: {
      ru: "Пешие маршруты (Ала-Арча)",
      kg: "Жөө жүрүштөр (Ала-Арча)",
      en: "Hiking Trails (Ala-Archa)",
    },
    phone: "+996 700 000 002",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    isFemale: false,
    isVerified: true,
    languages: {
      ru: "Кыргызский, Русский, Английский",
      kg: "Кыргызча, Орусча, Англисче",
      en: "Kyrgyz, Russian, English",
    },
  },
  {
    id: "guide-2",
    name: "Гульнара Токтогулова",
    category: "guide",
    categoryLabel: {
      ru: "Гид",
      kg: "Гид",
      en: "Guide",
    },
    locationTag: {
      ru: "Эко-туры и водопады (Аламедин)",
      kg: "Эко-турлар жана шаркыратмалар (Аламүдүн)",
      en: "Eco-tours & Waterfalls (Alamedin)",
    },
    phone: "+996 700 000 001",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    isFemale: true,
    isVerified: true,
    languages: {
      ru: "Кыргызский, Русский, Английский",
      kg: "Кыргызча, Орусча, Англисче",
      en: "Kyrgyz, Russian, English",
    },
  },
  {
    id: "guide-3",
    name: "Алина Таалайбек",
    category: "agency",
    categoryLabel: {
      ru: "Турагентство",
      kg: "Турагенттик",
      en: "Travel Agency",
    },
    locationTag: {
      ru: "Треккинг и лагеря (Чункурчак)",
      kg: "Треккинг жана лагерлер (Чүңкүрчак)",
      en: "Trekking & Camps (Chunkurchak)",
    },
    phone: "+996 700 000 003",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    isFemale: true,
    isVerified: true,
    languages: {
      ru: "Кыргызский, Русский, Английский",
      kg: "Кыргызча, Орусча, Англисче",
      en: "Kyrgyz, Russian, English",
    },
  },
];
