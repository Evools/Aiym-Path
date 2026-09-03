import { RouteItem } from "@/types/route.types";
import { GuidebookItem } from "@/types/guidebook.types";

export interface AdminGuideBadge {
  id: string;
  icon: string; // Lucide icon name, e.g. "HeartPulse", "Mountain", "Compass", "Camera", "Tent", "ShieldCheck", "Footprints", "Sparkles", "Trees", "Coffee", "Car", "Sun", "Award", "Navigation", "Flame"
  label: {
    ru: string;
    kg: string;
    en: string;
  };
}

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
  email?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  priceRange?: string;
  experienceYears: number;
  languages: string[];
  locations: string[];
  specialties?: string[];
  groupSize: string;
  skills: {
    firstAid: boolean;
    mountaineer: boolean;
    mountainGuide: boolean;
  };
  badges?: AdminGuideBadge[];
  isFemale: boolean;
  isVerified: boolean;
  rating?: number;
  routesCount?: number;
  reviewsCount?: number;
  bio?: {
    ru: string;
    kg: string;
    en: string;
  };
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

export interface AdminRegionItem {
  id: string;
  label: {
    ru: string;
    kg: string;
    en: string;
  };
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

export const AdminStorageService = {
  // --- ROUTES ---
  async getRoutes(region?: string): Promise<RouteItem[]> {
    try {
      const url = region && region !== "all" ? `/api/routes?region=${region}` : "/api/routes";
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.error("Failed to fetch routes from DB:", err);
      return [];
    }
  },

  async getRouteById(id: string): Promise<RouteItem | null> {
    try {
      const res = await fetch(`/api/routes/${id}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Failed to fetch route by id from DB:", err);
      return null;
    }
  },

  async saveRoute(route: RouteItem): Promise<boolean> {
    try {
      const res = await fetch(`/api/routes/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route),
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to save route to DB:", err);
      return false;
    }
  },

  async deleteRoute(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/routes/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to delete route from DB:", err);
      return false;
    }
  },

  // --- GUIDES ---
  async getGuides(category?: string, isFemale?: boolean): Promise<AdminGuideItem[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (isFemale !== undefined) params.append("isFemale", String(isFemale));
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/guides${query}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.error("Failed to fetch guides from DB:", err);
      return [];
    }
  },

  async getGuideById(id: string): Promise<AdminGuideItem | null> {
    try {
      const res = await fetch(`/api/guides/${id}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Failed to fetch guide by id from DB:", err);
      return null;
    }
  },

  async saveGuide(guide: AdminGuideItem): Promise<boolean> {
    try {
      const res = await fetch(`/api/guides/${guide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guide),
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to save guide to DB:", err);
      return false;
    }
  },

  async deleteGuide(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/guides/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to delete guide from DB:", err);
      return false;
    }
  },

  // --- LOCATIONS & HOTELS ---
  async getLocations(type?: string): Promise<AdminLocationItem[]> {
    try {
      const query = type ? `?type=${type}` : "";
      const res = await fetch(`/api/locations${query}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.error("Failed to fetch locations from DB:", err);
      return [];
    }
  },

  async getLocationById(id: string): Promise<AdminLocationItem | null> {
    try {
      const res = await fetch(`/api/locations/${id}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Failed to fetch location by id from DB:", err);
      return null;
    }
  },

  async saveLocation(loc: AdminLocationItem): Promise<boolean> {
    try {
      const res = await fetch(`/api/locations/${loc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loc),
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to save location to DB:", err);
      return false;
    }
  },

  async deleteLocation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to delete location from DB:", err);
      return false;
    }
  },

  // --- REGIONS ---
  async getRegions(): Promise<AdminRegionItem[]> {
    try {
      const res = await fetch("/api/regions", { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.error("Failed to fetch regions from DB:", err);
      return [];
    }
  },

  async saveRegion(region: AdminRegionItem): Promise<boolean> {
    try {
      const res = await fetch("/api/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(region),
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to save region to DB:", err);
      return false;
    }
  },

  async deleteRegion(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/regions/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to delete region from DB:", err);
      return false;
    }
  },

  // --- GUIDEBOOK ITEMS ---
  async getGuidebookItems(audience?: string, category?: string): Promise<GuidebookItem[]> {
    try {
      const params = new URLSearchParams();
      if (audience) params.append("audience", audience);
      if (category) params.append("category", category);
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/guidebook${query}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (err) {
      console.error("Failed to fetch guidebook items from DB:", err);
      return [];
    }
  },

  async getGuidebookItemById(id: string): Promise<GuidebookItem | null> {
    try {
      const res = await fetch(`/api/guidebook/${id}`, { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (err) {
      console.error("Failed to fetch guidebook item by id from DB:", err);
      return null;
    }
  },

  async saveGuidebookItem(item: GuidebookItem): Promise<boolean> {
    try {
      const res = await fetch(`/api/guidebook/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to save guidebook item to DB:", err);
      return false;
    }
  },

  async deleteGuidebookItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/guidebook/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to delete guidebook item from DB:", err);
      return false;
    }
  },

  // --- PROJECT CONTACTS & EMERGENCY ---
  async getContacts(): Promise<AdminProjectContacts> {
    try {
      const res = await fetch("/api/contacts", { cache: "no-store" });
      const json = await res.json();
      return json.success ? json.data : DEFAULT_CONTACTS;
    } catch (err) {
      console.error("Failed to fetch contacts from DB:", err);
      return DEFAULT_CONTACTS;
    }
  },

  async saveContacts(contacts: AdminProjectContacts): Promise<boolean> {
    try {
      const res = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacts),
      });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Failed to save contacts to DB:", err);
      return false;
    }
  },

  // Reset to default seed data
  async resetAll(): Promise<boolean> {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      const json = await res.json();
      return json.success;
    } catch (err) {
      console.error("Reset API failed:", err);
      return false;
    }
  },
};
