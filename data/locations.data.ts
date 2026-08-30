import { ProjectLocation } from "@/types/location.types";

export const INITIAL_LOCATIONS: ProjectLocation[] = [
  {
    id: "loc-ala-archa",
    key: "alaArcha",
    title: {
      ru: "Ущелье Ала-Арча",
      kg: "Ала-Арча капчыгайы",
      en: "Ala-Archa Gorge",
    },
    desc: {
      ru: "Пешие и хайкинг маршруты вблизи Бишкека с развитой базовой инфраструктурой и альплагерем.",
      kg: "Бишкекке жакын, өнүккөн базалык инфраструктурасы бар жөө жүрүш жолдору.",
      en: "Scenic hiking trails near Bishkek with established basic infrastructure and alpine camp.",
    },
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    difficulty: "medium",
    distanceKm: 12.5,
    elevationGainMeters: 800,
    hasFemaleGuide: true,
    hasEmergencyPoints: true,
  },
  {
    id: "loc-alamedin",
    key: "alamedin",
    title: {
      ru: "Ущелье Аламедин",
      kg: "Аламүдүн капчыгайы",
      en: "Alamedin Gorge",
    },
    desc: {
      ru: "Живописные природные тропы с выходом к водопадам, березовым рощам и целебным источникам.",
      kg: "Шаркыратмаларга, кайың токоюна жана дары булактарга алып баруучу кооз табигый чыйырлар.",
      en: "Picturesque nature paths leading to waterfalls, birch groves and geothermal springs.",
    },
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    difficulty: "easy",
    distanceKm: 8.0,
    elevationGainMeters: 350,
    hasFemaleGuide: true,
    hasEmergencyPoints: true,
  },
  {
    id: "loc-chunkurchak",
    key: "chunkurchak",
    title: {
      ru: "Чункурчак",
      kg: "Чүңкүрчак",
      en: "Chunkurchak Valley",
    },
    desc: {
      ru: "Горные плато и семейные сервисы с панорамными видами на окрестности Чуйской долины.",
      kg: "Чүй өрөөнүнө панорамалык көрүнүшү бар тоолуу плато жана үй-бүлөлүк эс алуу жайлары.",
      en: "High alpine plateau offering panoramic views and family-friendly eco-services.",
    },
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    difficulty: "easy",
    distanceKm: 5.5,
    elevationGainMeters: 200,
    hasFemaleGuide: true,
    hasEmergencyPoints: true,
  },
];
