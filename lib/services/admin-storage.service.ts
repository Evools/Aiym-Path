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
    id: "guide-ruslan",
    name: "Руслан Маматкулов",
    category: "guide",
    role: {
      ru: "Горный спасатель и старший гид (KMGA)",
      kg: "Тоо куткаруучусу жана башкы гид (KMGA)",
      en: "Mountain Rescuer & Lead Guide (KMGA)",
    },
    image: "/images/guides/guide-1.webp",
    phone: "+996 700 000 002",
    experienceYears: 9,
    languages: ["Русский", "Кыргызча", "English"],
    locations: ["Бишкек", "Ала-Арча", "Каракол"],
    groupSize: "1–10 человек",
    skills: {
      firstAid: true,
      mountaineer: true,
      mountainGuide: true,
    },
    isFemale: false,
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
    id: "guide-bektur",
    name: "Бектур Садыков",
    category: "guide",
    role: {
      ru: "Инструктор по выживанию и треккингу",
      kg: "Треккинг жана жаратылышта жашоо инструктору",
      en: "Wilderness Survival & Trekking Instructor",
    },
    image: "/images/guides/guide-1.webp",
    phone: "+996 703 334 455",
    experienceYears: 7,
    languages: ["Русский", "Кыргызча"],
    locations: ["Нарын", "Сон-Көл", "Кель-Суу"],
    groupSize: "1–8 человек",
    skills: {
      firstAid: true,
      mountaineer: true,
      mountainGuide: true,
    },
    isFemale: false,
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
  {
    id: "guide-urmat",
    name: "Урмат Кадыров",
    category: "agency",
    role: {
      ru: "Руководитель клуба горных походов",
      kg: "Тоо саякаттар клубунун жетекчиси",
      en: "Mountain Club Director & Lead Guide",
    },
    image: "/images/guides/guide-1.webp",
    phone: "+996 550 112 233",
    experienceYears: 10,
    languages: ["Русский", "Кыргызча", "English"],
    locations: ["Ош", "Чункурчак", "Ысык-Көл"],
    groupSize: "до 15 человек",
    skills: {
      firstAid: true,
      mountaineer: true,
      mountainGuide: true,
    },
    isFemale: false,
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
    amenities: ["Охрана 24/7", "Wi-Fi", "Тёплые домики", "Женский персонал", "Медпункт"],
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
    amenities: ["Связь МЧС", "Парковка", "Инструкторы", "Медпункт / SOS"],
  },
  {
    id: "loc-son-kul-yurts",
    title: {
      ru: "Эко-юрточный лагерь «Сон-Көл Айым»",
      kg: "«Соң-Көл Айым» эко-боз үй лагери",
      en: "Son-Kul Aiym Eco-Yurt Camp",
    },
    description: {
      ru: "Традиционный юрточный лагерь на берегу высокогорного озера Сон-Көл с женским персоналом и экологическим питанием.",
      kg: "Соң-Көл жээгиндеги аялдар персоналы жана табигый тамак-ашы бар салттуу боз үй лагери.",
      en: "Traditional yurt camp on the shores of alpine Lake Son-Kul with female host team and organic meals.",
    },
    type: "camp",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    coordinates: [41.8333, 75.15],
    phone: "+996 772 334 455",
    amenities: ["Женский персонал", "Национальная кухня", "Тёплые юрты", "Верховая езда"],
  },
  {
    id: "loc-karakol-hub",
    title: {
      ru: "Женский хаб безопасности «Каракол»",
      kg: "«Каракол» аялдар коопсуздук хабы",
      en: "Karakol Female Safety Hub & Info",
    },
    description: {
      ru: "Информационный центр для соло-путешественниц: аренда спутниковых трекеров, консультации female-гидов и экстренная помощь.",
      kg: "Жалгыз саякаттаган аялдар үчүн маалымат борбору: спутник трекерлери, гиддердин кеңештери жана шашылыш жардам.",
      en: "Resource hub for solo female travelers: satellite tracker rental, female guide consultations, and emergency aid.",
    },
    type: "hub",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
    coordinates: [42.4907, 78.3936],
    phone: "+996 705 009 102",
    amenities: ["Медпункт / SOS", "Wi-Fi", "Спутниковая связь", "Аренда трекеров"],
  },
  {
    id: "loc-alamedin-springs",
    title: {
      ru: "Оздоровительный комплекс «Тёплые ключи Аламедин»",
      kg: "«Аламүдүн жылуу суулары» ден соолук комплекси",
      en: "Alamedin Hot Springs Resort",
    },
    description: {
      ru: "Термальные радоновые источники, спа-процедуры, комфортабельные коттеджи и закрытая охраняемая территория.",
      kg: "Термалдык радон булактары, спа процедуралары, ыңгайлуу коттедждер жана кайтарылган аймак.",
      en: "Thermal mineral springs, spa treatments, comfortable chalets and private secure grounds.",
    },
    type: "hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    coordinates: [42.6167, 74.6833],
    phone: "+996 555 123 789",
    amenities: ["Охрана 24/7", "Бассейн с термальной водой", "Wi-Fi", "Кафе"],
  },
  {
    id: "loc-arslanbob-eco",
    title: {
      ru: "Гостевой дом «Арсланбоб Айым»",
      kg: "«Арсланбоб Айым» конок үйү",
      en: "Arslanbob Aiym Eco-Guesthouse",
    },
    description: {
      ru: "Уютный семейный эко-отель в реликтовом ореховом лесу, управляемый местным женским кооперативом.",
      kg: "Жергиликтүү аялдар кооперативи жетектеген жаңгак токоюндагы жайлуу үй-бүлөлүк эко-конок үй.",
      en: "Cozy family eco-stay in the ancient walnut forest run by a local women's cooperative.",
    },
    type: "camp",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    coordinates: [41.3361, 72.9306],
    phone: "+996 770 889 900",
    amenities: ["Женский персонал", "Эко-продукты", "Экскурсии в лес", "Wi-Fi"],
  },
];

export const DEFAULT_REGIONS: AdminRegionItem[] = [
  {
    id: "chuy",
    label: {
      ru: "Чуйская область",
      kg: "Чүй облусу",
      en: "Chuy Region",
    },
  },
  {
    id: "issyk-kul",
    label: {
      ru: "Иссык-Кульская область",
      kg: "Ысык-Көл облусу",
      en: "Issyk-Kul Region",
    },
  },
  {
    id: "naryn",
    label: {
      ru: "Нарынская область",
      kg: "Нарын облусу",
      en: "Naryn Region",
    },
  },
  {
    id: "osh",
    label: {
      ru: "Ошская область",
      kg: "Ош облусу",
      en: "Osh Region",
    },
  },
  {
    id: "jalal-abad",
    label: {
      ru: "Джалал-Абадская область",
      kg: "Жалал-Абад облусу",
      en: "Jalal-Abad Region",
    },
  },
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

  // --- EQUIPMENT CHECKLIST ---
  async getChecklistItems(): Promise<import("@/types/guidebook.types").ChecklistItem[]> {
    const { EQUIPMENT_CHECKLIST } = await import("@/data/guidebook.data");
    try {
      const res = await fetch("/api/checklist", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        if (typeof window !== "undefined") {
          localStorage.setItem("aiym_admin_checklist", JSON.stringify(json.data));
        }
        return json.data;
      }
    } catch (e) {
      console.error("Failed to fetch checklist from DB:", e);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aiym_admin_checklist");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return EQUIPMENT_CHECKLIST;
  },

  async saveChecklistItem(item: import("@/types/guidebook.types").ChecklistItem): Promise<boolean> {
    try {
      const res = await fetch("/api/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        const list = await this.getChecklistItems();
        const idx = list.findIndex((i) => i.id === item.id);
        const updated = idx >= 0 ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
        localStorage.setItem("aiym_admin_checklist", JSON.stringify(updated));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to save checklist item to DB:", err);
      return false;
    }
  },

  async deleteChecklistItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/checklist?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        const list = await this.getChecklistItems();
        const updated = list.filter((i) => i.id !== id);
        localStorage.setItem("aiym_admin_checklist", JSON.stringify(updated));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to delete checklist item from DB:", err);
      return false;
    }
  },

  // --- PDF OFFICIAL MANUALS & GUIDES (GOOGLE DRIVE) ---
  async getPdfResources(): Promise<import("@/types/guidebook.types").PdfResourceItem[]> {
    const { DEFAULT_PDF_RESOURCES } = await import("@/data/guidebook.data");
    try {
      const res = await fetch("/api/pdf-resources", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        if (typeof window !== "undefined") {
          localStorage.setItem("aiym_admin_pdf_resources", JSON.stringify(json.data));
        }
        return json.data;
      }
    } catch (e) {
      console.error("Failed to fetch PDF resources from DB:", e);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aiym_admin_pdf_resources");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PDF_RESOURCES;
  },

  async savePdfResource(item: import("@/types/guidebook.types").PdfResourceItem): Promise<boolean> {
    try {
      const res = await fetch("/api/pdf-resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        const list = await this.getPdfResources();
        const idx = list.findIndex((i) => i.id === item.id);
        const updated = idx >= 0 ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
        localStorage.setItem("aiym_admin_pdf_resources", JSON.stringify(updated));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to save PDF resource to DB:", err);
      return false;
    }
  },

  async deletePdfResource(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/pdf-resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        const list = await this.getPdfResources();
        const updated = list.filter((i) => i.id !== id);
        localStorage.setItem("aiym_admin_pdf_resources", JSON.stringify(updated));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to delete PDF resource from DB:", err);
      return false;
    }
  },

  // --- DIFFICULTY LEVELS & PREPARATION GUIDE ---
  async getDifficultyLevels(): Promise<import("@/types/guidebook.types").DifficultyLevelGuide[]> {
    const { DIFFICULTY_LEVELS_GUIDE } = await import("@/data/guidebook.data");
    try {
      const res = await fetch("/api/difficulty-levels", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        if (typeof window !== "undefined") {
          localStorage.setItem("aiym_admin_difficulty_levels", JSON.stringify(json.data));
        }
        return json.data;
      }
    } catch (e) {
      console.error("Failed to fetch difficulty levels from DB:", e);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aiym_admin_difficulty_levels");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return DIFFICULTY_LEVELS_GUIDE;
  },

  async saveDifficultyLevel(item: import("@/types/guidebook.types").DifficultyLevelGuide): Promise<boolean> {
    try {
      const res = await fetch("/api/difficulty-levels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        const list = await this.getDifficultyLevels();
        const idx = list.findIndex((i) => i.id === item.id);
        const updated = idx >= 0 ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
        localStorage.setItem("aiym_admin_difficulty_levels", JSON.stringify(updated));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to save difficulty level to DB:", err);
      return false;
    }
  },

  async deleteDifficultyLevel(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/difficulty-levels?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        const list = await this.getDifficultyLevels();
        const updated = list.filter((i) => i.id !== id);
        localStorage.setItem("aiym_admin_difficulty_levels", JSON.stringify(updated));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to delete difficulty level from DB:", err);
      return false;
    }
  },

  // --- HERO BANNER ---
  async getHeroBanner(): Promise<import("@/types/banner.types").HeroBannerData> {
    const { DEFAULT_HERO_BANNER } = await import("@/types/banner.types");
    try {
      const res = await fetch("/api/banner", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("aiym_admin_hero_banner", JSON.stringify(json.data));
        }
        return json.data;
      }
    } catch (err) {
      console.error("Failed to fetch banner from API/DB:", err);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aiym_admin_hero_banner");
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_HERO_BANNER, ...parsed };
        }
      } catch (e) {
        console.error("Failed to read banner from localStorage:", e);
      }
    }
    return DEFAULT_HERO_BANNER;
  },

  async saveHeroBanner(banner: import("@/types/banner.types").HeroBannerData): Promise<boolean> {
    try {
      const res = await fetch("/api/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("aiym_admin_hero_banner", JSON.stringify(banner));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to save hero banner to DB:", err);
      return false;
    }
  },

  async resetHeroBanner(): Promise<boolean> {
    try {
      const res = await fetch("/api/banner", { method: "POST" });
      const json = await res.json();
      if (typeof window !== "undefined") {
        localStorage.removeItem("aiym_admin_hero_banner");
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to reset hero banner in DB:", err);
      return false;
    }
  },

  // --- SITE LOGO & BRANDING ---
  async getLogoSettings(): Promise<import("@/types/settings.types").SiteLogoData> {
    const { DEFAULT_SITE_LOGO } = await import("@/types/settings.types");
    try {
      const res = await fetch("/api/settings/logo", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("aiym_admin_site_logo", JSON.stringify(json.data));
        }
        return json.data;
      }
    } catch (err) {
      console.error("Failed to fetch logo settings from API/DB:", err);
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aiym_admin_site_logo");
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_SITE_LOGO, ...parsed };
        }
      } catch (e) {
        console.error("Failed to read logo from localStorage:", e);
      }
    }
    return DEFAULT_SITE_LOGO;
  },

  async saveLogoSettings(logo: import("@/types/settings.types").SiteLogoData): Promise<boolean> {
    try {
      const res = await fetch("/api/settings/logo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logo),
      });
      const json = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("aiym_admin_site_logo", JSON.stringify(logo));
        window.dispatchEvent(new Event("aiym_path_logo_change"));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to save logo settings to DB:", err);
      return false;
    }
  },

  async resetLogoSettings(): Promise<boolean> {
    try {
      const res = await fetch("/api/settings/logo", { method: "POST" });
      const json = await res.json();
      if (typeof window !== "undefined") {
        localStorage.removeItem("aiym_admin_site_logo");
        window.dispatchEvent(new Event("aiym_path_logo_change"));
      }
      return json.success ?? true;
    } catch (err) {
      console.error("Failed to reset logo in DB:", err);
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

export function getGoogleDriveDirectDownloadLink(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const matchFile = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) {
    return `https://drive.google.com/uc?export=download&id=${matchFile[1]}`;
  }
  const matchId = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://drive.google.com/uc?export=download&id=${matchId[1]}`;
  }
  return trimmed;
}
