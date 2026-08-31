import { RouteItem, AssignedGuide } from "@/types/route.types";
import { ProjectLocation } from "@/types/location.types";
import { GuidebookItem } from "@/types/guidebook.types";
import { ROUTES_DATA } from "@/data/routes.data";
import { INITIAL_LOCATIONS } from "@/data/locations.data";
import { GUIDEBOOK_ITEMS } from "@/data/guidebook.data";

export interface AdminGuideItem {
  id: string;
  name: string;
  category: "guide" | "agency";
  role: {
    ru: string;
    kg: string;
    en: string;
  };
  image: string;
  phone: string;
  experienceYears: number;
  languages: string[];
  locations: string[];
  groupSize: string;
  skills: {
    firstAid: boolean;
    mountaineer: boolean;
    mountainGuide: boolean;
  };
  isFemale: boolean;
  isVerified: boolean;
}

export interface AdminLocationItem {
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
  type: "hotel" | "camp" | "hub";
  image: string;
  coordinates: [number, number];
  phone?: string;
  amenities?: string[];
}

export interface AdminEmergencyContact {
  id: string;
  name: { ru: string; kg: string; en: string };
  number: string;
  badge: { ru: string; kg: string; en: string };
  description: { ru: string; kg: string; en: string };
  isMain?: boolean;
  isWhatsApp?: boolean;
}

export interface AdminProjectContacts {
  email: string;
  phone: string;
  address: { ru: string; kg: string; en: string };
  workingHours: { ru: string; kg: string; en: string };
  emergencyContacts: AdminEmergencyContact[];
}

export const DEFAULT_CONTACTS: AdminProjectContacts = {
  email: "info@aiympath.kg",
  phone: "+996 700 000 001",
  address: {
    ru: "г. Бишкек, Кыргызская Республика",
    kg: "Бишкек ш., Кыргыз Республикасы",
    en: "Bishkek, Kyrgyz Republic",
  },
  workingHours: {
    ru: "Пн–Пт, 09:00–18:00",
    kg: "Дүй–Жум, 09:00–18:00",
    en: "Mon–Fri, 09:00–18:00",
  },
  emergencyContacts: [
    {
      id: "sos-112",
      name: {
        ru: "Единая служба экстренной помощи (МЧС)",
        kg: "Бирдиктүү шашылыш жардам кызматы (ӨКМ)",
        en: "Unified Emergency Dispatch (All Services)",
      },
      number: "112",
      badge: { ru: "24/7 • Бесплатно", kg: "24/7 • Акысыз", en: "24/7 • Free Call" },
      description: {
        ru: "Единый номер для всех экстренных служб, работает без SIM-карты",
        kg: "Бардык шашылыш кызматтар үчүн бирдиктүү номер, SIM-картасыз да иштейт",
        en: "All emergency services, accessible even without a SIM card",
      },
      isMain: true,
    },
    {
      id: "sos-102",
      name: {
        ru: "Полиция (Милиция)",
        kg: "Милиция",
        en: "Police Department",
      },
      number: "102",
      badge: { ru: "Круглосуточно", kg: "Күнү-түнү", en: "24/7 Service" },
      description: {
        ru: "Защита правопорядка, реагирование на правонарушения и угрозы",
        kg: "Коомдук коопсуздукту коргоо жана мыйзам бузууларга чара көрүү",
        en: "Law enforcement, urgent safety threats, and rapid response",
      },
    },
    {
      id: "sos-103",
      name: {
        ru: "Скорая медицинская помощь",
        kg: "Тез медициналык жардам",
        en: "Ambulance & Medical Aid",
      },
      number: "103",
      badge: { ru: "Круглосуточно", kg: "Күнү-түнү", en: "24/7 Service" },
      description: {
        ru: "Неотложная медицинская помощь при травмах и заболеваниях",
        kg: "Жаракат алганда жана ооруп калганда тез медициналык жардам",
        en: "Emergency trauma and medical assistance across regions",
      },
    },
    {
      id: "sos-101",
      name: {
        ru: "Пожарно-спасательная служба",
        kg: "Өрт өчүрүү жана куткаруу кызматы",
        en: "Fire & Rescue Service",
      },
      number: "101",
      badge: { ru: "Круглосуточно", kg: "Күнү-түнү", en: "24/7 Service" },
      description: {
        ru: "Ликвидация пожаров, эвакуация и спасательные операции",
        kg: "Өрттү өчүрүү, эвакуация жана куткаруу иштери",
        en: "Firefighting, evacuation, and emergency rescue operations",
      },
    },
    {
      id: "sos-117",
      name: {
        ru: "Горячая линия по вопросам гендерного насилия",
        kg: "Гендердик зомбулук маселелери боюнча түз байланыш",
        en: "Domestic & Gender-Based Violence Hotline",
      },
      number: "117",
      badge: { ru: "Анонимно • Бесплатно", kg: "Анонимдүү • Акысыз", en: "Anonymous • Free" },
      description: {
        ru: "Психологическая и правовая поддержка женщин в кризисных ситуациях",
        kg: "Кризистик кырдаалда калган аялдарга психологиялык жана укуктук колдоо",
        en: "Psychological and legal crisis counseling for women",
      },
    },
    {
      id: "sos-sezim",
      name: {
        ru: "Кризисный центр «Сезим» (Бишкек)",
        kg: "«Сезим» кризистик борбору (Бишкек)",
        en: "Sezim Crisis Center (Bishkek)",
      },
      number: "+996 312 66-15-92",
      badge: { ru: "Центр помощи", kg: "Жардам борбору", en: "Crisis Center" },
      description: {
        ru: "Ассоциация кризисных центров Кыргызстана, шелтер и юристы",
        kg: "Кыргызстандын кризистик борборлор ассоциациясы, башпаанек жана юристтер",
        en: "Shelter, direct assistance, and legal aid for women in Kyrgyzstan",
      },
    },
    {
      id: "sos-tourist-police",
      name: {
        ru: "Туристическая милиция (Иссык-Куль)",
        kg: "Туристтик милиция (Ысык-Көл)",
        en: "Tourist Police (Issyk-Kul)",
      },
      number: "+996 705 00 91 02",
      badge: { ru: "RU/EN • WhatsApp", kg: "RU/EN • WhatsApp", en: "RU/EN • WhatsApp" },
      description: {
        ru: "Поддержка туристов на английском и русском языках (сезонно)",
        kg: "Англис жана орус тилдеринде туристтерге жардам (сезондук)",
        en: "Bilingual tourist security and assistance via Phone and WhatsApp",
      },
      isWhatsApp: true,
    },
  ],
};

const DEFAULT_GUIDES: AdminGuideItem[] = [
  {
    id: "guide-aisuluu",
    name: "Айсулуу Жумабекова",
    category: "guide",
    role: {
      ru: "Лицензированный горный гид",
      kg: "Лицензияланган тоо гиди",
      en: "Certified Mountain Guide",
    },
    image: "/images/guides/guide-2.jpg",
    phone: "+996 701 112 233",
    experienceYears: 6,
    languages: ["Русский", "Кыргызча", "English"],
    locations: ["Бишкек", "Ала-Арча", "Чуй"],
    groupSize: "1–8 человек",
    skills: {
      firstAid: true,
      mountaineer: true,
      mountainGuide: true,
    },
    isFemale: true,
    isVerified: true,
  },
  {
    id: "guide-nargiza",
    name: "Наргиза Касымова",
    category: "guide",
    role: {
      ru: "Инструктор по треккингу (WFA)",
      kg: "Треккинг боюнча инструктор (WFA)",
      en: "Trekking Instructor (WFA)",
    },
    image: "/images/guides/guide-3.jpg",
    phone: "+996 555 443 322",
    experienceYears: 4,
    languages: ["Русский", "English"],
    locations: ["Каракол", "Ысык-Көл", "Жеты-Огуз"],
    groupSize: "до 10 человек",
    skills: {
      firstAid: true,
      mountaineer: true,
      mountainGuide: false,
    },
    isFemale: true,
    isVerified: true,
  },
  {
    id: "guide-gulmira",
    name: "Гульмира Токтогулова",
    category: "agency",
    role: {
      ru: "Эксперт по эко-туризму и травам",
      kg: "Эко-туризм жана дары чөптөр боюнча адис",
      en: "Eco-tourism & Alpine Flora Expert",
    },
    image: "/images/guides/guide-2.jpg",
    phone: "+996 700 998 877",
    experienceYears: 8,
    languages: ["Русский", "Кыргызча"],
    locations: ["Ош", "Сары-Челек", "Арсланбоб"],
    groupSize: "1–12 человек",
    skills: {
      firstAid: true,
      mountaineer: false,
      mountainGuide: true,
    },
    isFemale: true,
    isVerified: true,
  },
];

const DEFAULT_LOCATIONS: AdminLocationItem[] = [
  {
    id: "loc-chunkurchak-resort",
    title: {
      ru: "Эко-резорт Чункурчак",
      kg: "Чүңкүрчак эко-резорту",
      en: "Chunkurchak Eco-Resort",
    },
    description: {
      ru: "Сертифицированная база отдыха с охраной 24/7, женскими шале, прокатом снаряжения и медпунктом.",
      kg: "Түнү бою күзөт кызматы, аялдар шалеси жана медициналык пункту бар эс алуу базасы.",
      en: "Verified resort with 24/7 security, female chalets, gear rental and medical station.",
    },
    type: "hotel",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    coordinates: [42.6389, 74.6281],
    phone: "+996 700 000 001",
    amenities: ["Охрана 24/7", "Wi-Fi", "Тёплые домики", "Женский персонал"],
  },
  {
    id: "loc-ala-archa-alp",
    title: {
      ru: "Альплагерь Ала-Арча",
      kg: "Ала-Арча альплагери",
      en: "Ala-Archa Alpine Basecamp",
    },
    description: {
      ru: "Круглогодичный высокогорный базовый лагерь, точка старта большинства маршрутов к Рацеку и ледникам.",
      kg: "Жыл бою иштеген бийик тоолуу базалык лагерь, Рацекке жана мөңгүлөргө баруучу жолдордун башталышы.",
      en: "Year-round high mountain basecamp and starting point for trails to Ratsek and glaciers.",
    },
    type: "camp",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
    coordinates: [42.5644, 74.4823],
    phone: "+996 312 000 000",
    amenities: ["Связь МЧС", "Парковка", "Инструкторы", "Медпункт"],
  },
];

export interface AdminRegionItem {
  id: string;
  label: {
    ru: string;
    kg: string;
    en: string;
  };
}

export const DEFAULT_REGIONS: AdminRegionItem[] = [
  {
    id: "ala-archa",
    label: {
      ru: "Ущелье Ала-Арча",
      kg: "Ала-Арча капчыгайы",
      en: "Ala-Archa Gorge",
    },
  },
  {
    id: "alamedin",
    label: {
      ru: "Ущелье Аламедин",
      kg: "Аламүдүн капчыгайы",
      en: "Alamedin Gorge",
    },
  },
  {
    id: "chunkurchak",
    label: {
      ru: "Ущелье Чункурчак",
      kg: "Чүңкүрчак капчыгайы",
      en: "Chunkurchak Gorge",
    },
  },
];

const STORAGE_KEYS = {
  ROUTES: "aiym_path_routes_v1",
  GUIDES: "aiym_path_guides_v1",
  LOCATIONS: "aiym_path_locations_v1",
  REGIONS: "aiym_path_regions_v1",
  GUIDEBOOK: "aiym_path_guidebook_v1",
  CONTACTS: "aiym_path_contacts_v1",
};

export const AdminStorageService = {
  // --- ROUTES ---
  getRoutes(): RouteItem[] {
    if (typeof window === "undefined") return ROUTES_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTES);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(ROUTES_DATA));
      return ROUTES_DATA;
    } catch {
      return ROUTES_DATA;
    }
  },

  getRouteById(id: string): RouteItem | null {
    const routes = this.getRoutes();
    return routes.find((r) => r.id === id) || null;
  },

  saveRoute(route: RouteItem): void {
    if (typeof window === "undefined") return;
    const routes = this.getRoutes();
    const existingIndex = routes.findIndex((r) => r.id === route.id);
    if (existingIndex >= 0) {
      routes[existingIndex] = route;
    } else {
      routes.unshift(route);
    }
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  },

  deleteRoute(id: string): void {
    if (typeof window === "undefined") return;
    const routes = this.getRoutes().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  },

  // --- GUIDES ---
  getGuides(): AdminGuideItem[] {
    if (typeof window === "undefined") return DEFAULT_GUIDES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUIDES);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(DEFAULT_GUIDES));
      return DEFAULT_GUIDES;
    } catch {
      return DEFAULT_GUIDES;
    }
  },

  saveGuide(guide: AdminGuideItem): void {
    if (typeof window === "undefined") return;
    const guides = this.getGuides();
    const existingIndex = guides.findIndex((g) => g.id === guide.id);
    if (existingIndex >= 0) {
      guides[existingIndex] = guide;
    } else {
      guides.unshift(guide);
    }
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
  },

  deleteGuide(id: string): void {
    if (typeof window === "undefined") return;
    const guides = this.getGuides().filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
  },

  // --- LOCATIONS & HOTELS ---
  getLocations(): AdminLocationItem[] {
    if (typeof window === "undefined") return DEFAULT_LOCATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
      return DEFAULT_LOCATIONS;
    } catch {
      return DEFAULT_LOCATIONS;
    }
  },

  saveLocation(loc: AdminLocationItem): void {
    if (typeof window === "undefined") return;
    const locations = this.getLocations();
    const existingIndex = locations.findIndex((l) => l.id === loc.id);
    if (existingIndex >= 0) {
      locations[existingIndex] = loc;
    } else {
      locations.unshift(loc);
    }
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  },

  deleteLocation(id: string): void {
    if (typeof window === "undefined") return;
    const locations = this.getLocations().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  },

  // --- REGIONS ---
  getRegions(): AdminRegionItem[] {
    if (typeof window === "undefined") return DEFAULT_REGIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(DEFAULT_REGIONS));
      return DEFAULT_REGIONS;
    } catch {
      return DEFAULT_REGIONS;
    }
  },

  saveRegion(region: AdminRegionItem): void {
    if (typeof window === "undefined") return;
    const regions = this.getRegions();
    const existingIndex = regions.findIndex((r) => r.id === region.id);
    if (existingIndex >= 0) {
      regions[existingIndex] = region;
    } else {
      regions.push(region);
    }
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
  },

  deleteRegion(id: string): void {
    if (typeof window === "undefined") return;
    const regions = this.getRegions().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
  },

  // --- GUIDEBOOK ITEMS ---
  getGuidebookItems(): GuidebookItem[] {
    if (typeof window === "undefined") return GUIDEBOOK_ITEMS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUIDEBOOK);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(GUIDEBOOK_ITEMS));
      return GUIDEBOOK_ITEMS;
    } catch {
      return GUIDEBOOK_ITEMS;
    }
  },

  getGuidebookItemById(id: string): GuidebookItem | null {
    const items = this.getGuidebookItems();
    return items.find((i) => i.id === id) || null;
  },

  saveGuidebookItem(item: GuidebookItem): void {
    if (typeof window === "undefined") return;
    const items = this.getGuidebookItems();
    const existingIndex = items.findIndex((i) => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(items));
  },

  deleteGuidebookItem(id: string): void {
    if (typeof window === "undefined") return;
    const items = this.getGuidebookItems().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(items));
  },

  // --- PROJECT CONTACTS & EMERGENCY ---
  getContacts(): AdminProjectContacts {
    if (typeof window === "undefined") return DEFAULT_CONTACTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
      return DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  },

  saveContacts(contacts: AdminProjectContacts): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  // Reset to default seed data
  resetAll(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(ROUTES_DATA));
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(DEFAULT_GUIDES));
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(DEFAULT_REGIONS));
    localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(GUIDEBOOK_ITEMS));
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
  },
};
