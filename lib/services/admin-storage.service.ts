import { RouteItem } from "@/types/route.types";
import { GuidebookItem } from "@/types/guidebook.types";
import { ROUTES_DATA } from "@/data/routes.data";
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

export const DEFAULT_GUIDES: AdminGuideItem[] = [
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

export const DEFAULT_LOCATIONS: AdminLocationItem[] = [
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

function notifyStorageChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aiym_storage_updated"));
  }
}

// Background sync from Database / API to cache
async function syncFromApi<T>(endpoint: string, storageKey: string): Promise<T | null> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(json.data));
          notifyStorageChange();
        }
        return json.data as T;
      }
    }
  } catch (err) {
    console.warn(`Sync failed for ${endpoint}:`, err);
  }
  return null;
}

export const AdminStorageService = {
  // Initialize sync from API
  initSync(): void {
    if (typeof window === "undefined") return;
    syncFromApi("/api/routes", STORAGE_KEYS.ROUTES);
    syncFromApi("/api/guides", STORAGE_KEYS.GUIDES);
    syncFromApi("/api/locations", STORAGE_KEYS.LOCATIONS);
    syncFromApi("/api/regions", STORAGE_KEYS.REGIONS);
    syncFromApi("/api/guidebook", STORAGE_KEYS.GUIDEBOOK);
    syncFromApi("/api/contacts", STORAGE_KEYS.CONTACTS);
  },

  // --- ROUTES ---
  getRoutes(): RouteItem[] {
    if (typeof window === "undefined") return ROUTES_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTES);
      if (stored) {
        return JSON.parse(stored);
      }
      syncFromApi<RouteItem[]>("/api/routes", STORAGE_KEYS.ROUTES);
      return ROUTES_DATA;
    } catch {
      return ROUTES_DATA;
    }
  },

  async fetchRoutes(): Promise<RouteItem[]> {
    const data = await syncFromApi<RouteItem[]>("/api/routes", STORAGE_KEYS.ROUTES);
    return data || this.getRoutes();
  },

  getRouteById(id: string): RouteItem | null {
    const routes = this.getRoutes();
    return routes.find((r) => r.id === id) || null;
  },

  async saveRoute(route: RouteItem): Promise<void> {
    if (typeof window !== "undefined") {
      const routes = this.getRoutes();
      const existingIndex = routes.findIndex((r) => r.id === route.id);
      if (existingIndex >= 0) {
        routes[existingIndex] = route;
      } else {
        routes.unshift(route);
      }
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/routes/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route),
      });
    } catch (err) {
      console.error("Failed to persist route to DB:", err);
    }
  },

  async deleteRoute(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const routes = this.getRoutes().filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/routes/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete route from DB:", err);
    }
  },

  // --- GUIDES ---
  getGuides(): AdminGuideItem[] {
    if (typeof window === "undefined") return DEFAULT_GUIDES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUIDES);
      if (stored) {
        return JSON.parse(stored);
      }
      syncFromApi<AdminGuideItem[]>("/api/guides", STORAGE_KEYS.GUIDES);
      return DEFAULT_GUIDES;
    } catch {
      return DEFAULT_GUIDES;
    }
  },

  async fetchGuides(): Promise<AdminGuideItem[]> {
    const data = await syncFromApi<AdminGuideItem[]>("/api/guides", STORAGE_KEYS.GUIDES);
    return data || this.getGuides();
  },

  async saveGuide(guide: AdminGuideItem): Promise<void> {
    if (typeof window !== "undefined") {
      const guides = this.getGuides();
      const existingIndex = guides.findIndex((g) => g.id === guide.id);
      if (existingIndex >= 0) {
        guides[existingIndex] = guide;
      } else {
        guides.unshift(guide);
      }
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/guides/${guide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guide),
      });
    } catch (err) {
      console.error("Failed to persist guide to DB:", err);
    }
  },

  async deleteGuide(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const guides = this.getGuides().filter((g) => g.id !== id);
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/guides/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete guide from DB:", err);
    }
  },

  // --- LOCATIONS & HOTELS ---
  getLocations(): AdminLocationItem[] {
    if (typeof window === "undefined") return DEFAULT_LOCATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      syncFromApi<AdminLocationItem[]>("/api/locations", STORAGE_KEYS.LOCATIONS);
      return DEFAULT_LOCATIONS;
    } catch {
      return DEFAULT_LOCATIONS;
    }
  },

  async fetchLocations(): Promise<AdminLocationItem[]> {
    const data = await syncFromApi<AdminLocationItem[]>("/api/locations", STORAGE_KEYS.LOCATIONS);
    return data || this.getLocations();
  },

  async saveLocation(loc: AdminLocationItem): Promise<void> {
    if (typeof window !== "undefined") {
      const locations = this.getLocations();
      const existingIndex = locations.findIndex((l) => l.id === loc.id);
      if (existingIndex >= 0) {
        locations[existingIndex] = loc;
      } else {
        locations.unshift(loc);
      }
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/locations/${loc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loc),
      });
    } catch (err) {
      console.error("Failed to persist location to DB:", err);
    }
  },

  async deleteLocation(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const locations = this.getLocations().filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete location from DB:", err);
    }
  },

  // --- REGIONS ---
  getRegions(): AdminRegionItem[] {
    if (typeof window === "undefined") return DEFAULT_REGIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGIONS);
      if (stored) {
        return JSON.parse(stored);
      }
      syncFromApi<AdminRegionItem[]>("/api/regions", STORAGE_KEYS.REGIONS);
      return DEFAULT_REGIONS;
    } catch {
      return DEFAULT_REGIONS;
    }
  },

  async fetchRegions(): Promise<AdminRegionItem[]> {
    const data = await syncFromApi<AdminRegionItem[]>("/api/regions", STORAGE_KEYS.REGIONS);
    return data || this.getRegions();
  },

  async saveRegion(region: AdminRegionItem): Promise<void> {
    if (typeof window !== "undefined") {
      const regions = this.getRegions();
      const existingIndex = regions.findIndex((r) => r.id === region.id);
      if (existingIndex >= 0) {
        regions[existingIndex] = region;
      } else {
        regions.push(region);
      }
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
      notifyStorageChange();
    }

    try {
      await fetch("/api/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(region),
      });
    } catch (err) {
      console.error("Failed to persist region to DB:", err);
    }
  },

  async deleteRegion(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const regions = this.getRegions().filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/regions/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete region from DB:", err);
    }
  },

  // --- GUIDEBOOK ITEMS ---
  getGuidebookItems(): GuidebookItem[] {
    if (typeof window === "undefined") return GUIDEBOOK_ITEMS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUIDEBOOK);
      if (stored) {
        return JSON.parse(stored);
      }
      syncFromApi<GuidebookItem[]>("/api/guidebook", STORAGE_KEYS.GUIDEBOOK);
      return GUIDEBOOK_ITEMS;
    } catch {
      return GUIDEBOOK_ITEMS;
    }
  },

  async fetchGuidebookItems(): Promise<GuidebookItem[]> {
    const data = await syncFromApi<GuidebookItem[]>("/api/guidebook", STORAGE_KEYS.GUIDEBOOK);
    return data || this.getGuidebookItems();
  },

  getGuidebookItemById(id: string): GuidebookItem | null {
    const items = this.getGuidebookItems();
    return items.find((i) => i.id === id) || null;
  },

  async saveGuidebookItem(item: GuidebookItem): Promise<void> {
    if (typeof window !== "undefined") {
      const items = this.getGuidebookItems();
      const existingIndex = items.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        items[existingIndex] = item;
      } else {
        items.unshift(item);
      }
      localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(items));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/guidebook/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.error("Failed to persist guidebook item to DB:", err);
    }
  },

  async deleteGuidebookItem(id: string): Promise<void> {
    if (typeof window !== "undefined") {
      const items = this.getGuidebookItems().filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(items));
      notifyStorageChange();
    }

    try {
      await fetch(`/api/guidebook/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete guidebook item from DB:", err);
    }
  },

  // --- PROJECT CONTACTS & EMERGENCY ---
  getContacts(): AdminProjectContacts {
    if (typeof window === "undefined") return DEFAULT_CONTACTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (stored) {
        return JSON.parse(stored);
      }
      syncFromApi<AdminProjectContacts>("/api/contacts", STORAGE_KEYS.CONTACTS);
      return DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  },

  async fetchContacts(): Promise<AdminProjectContacts> {
    const data = await syncFromApi<AdminProjectContacts>("/api/contacts", STORAGE_KEYS.CONTACTS);
    return data || this.getContacts();
  },

  async saveContacts(contacts: AdminProjectContacts): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      notifyStorageChange();
    }

    try {
      await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacts),
      });
    } catch (err) {
      console.error("Failed to persist contacts to DB:", err);
    }
  },

  // Reset to default seed data
  async resetAll(): Promise<void> {
    try {
      await fetch("/api/reset", { method: "POST" });
    } catch (err) {
      console.error("Reset API failed:", err);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(ROUTES_DATA));
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(DEFAULT_GUIDES));
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
      localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(DEFAULT_REGIONS));
      localStorage.setItem(STORAGE_KEYS.GUIDEBOOK, JSON.stringify(GUIDEBOOK_ITEMS));
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
      notifyStorageChange();
    }
  },
};
