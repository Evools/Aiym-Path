import { RouteItem, AssignedGuide } from "@/types/route.types";
import { ProjectLocation } from "@/types/location.types";
import { ROUTES_DATA } from "@/data/routes.data";
import { INITIAL_LOCATIONS } from "@/data/locations.data";

export interface AdminGuideItem {
  id: string;
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

const DEFAULT_GUIDES: AdminGuideItem[] = [
  {
    id: "guide-aisuluu",
    name: "Айсулуу Жумабекова",
    role: {
      ru: "Лицензированный горный гид",
      kg: "Лицензияланган тоо гиди",
      en: "Certified Mountain Guide",
    },
    image: "/images/guides/guide-2.jpg",
    phone: "+996 701 112 233",
    experienceYears: 6,
    languages: ["Русский", "Кыргызча", "English"],
    isVerified: true,
  },
  {
    id: "guide-nargiza",
    name: "Наргиза Касымова",
    role: {
      ru: "Инструктор по треккингу (WFA)",
      kg: "Треккинг боюнча инструктор (WFA)",
      en: "Trekking Instructor (WFA)",
    },
    image: "/images/guides/guide-3.jpg",
    phone: "+996 555 443 322",
    experienceYears: 4,
    languages: ["Русский", "English"],
    isVerified: true,
  },
  {
    id: "guide-gulmira",
    name: "Гульмира Токтогулова",
    role: {
      ru: "Эксперт по эко-туризму и травам",
      kg: "Эко-туризм жана дары чөптөр боюнча адис",
      en: "Eco-tourism & Alpine Flora Expert",
    },
    image: "/images/guides/guide-4.jpg",
    phone: "+996 700 998 877",
    experienceYears: 8,
    languages: ["Русский", "Кыргызча"],
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

const STORAGE_KEYS = {
  ROUTES: "aiym_path_routes_v1",
  GUIDES: "aiym_path_guides_v1",
  LOCATIONS: "aiym_path_locations_v1",
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

  // Reset to default seed data
  resetAll(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(ROUTES_DATA));
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(DEFAULT_GUIDES));
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
  },
};
