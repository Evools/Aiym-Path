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
      ru: "Национальный парк в 40 км от Бишкека, ворота в высокогорье Киргизского хребта.",
      kg: "Бишкектен 40 км аралыктагы улуттук парк, Кыргыз кырка тоосунун бийик тоолоруна дарбаза.",
      en: "National park 40 km from Bishkek, the gateway to the Kyrgyz ridge highlands.",
    },
    imageUrl: "/images/locations/ala-archa.jpg",
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
      ru: "Горячие источники, хвойные леса и маршруты средней сложности.",
      kg: "Ысык булактар, ийне жалбырактуу токойлор жана орто татаалдыктагы маршруттар.",
      en: "Hot springs, coniferous forests, and moderate difficulty trails.",
    },
    imageUrl: "/images/locations/alamedin.jpg",
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
      en: "Chunkurchak",
    },
    desc: {
      ru: "Плато и предгорья рядом с Бишкеком, подходит для однодневных прогулок.",
      kg: "Бишкектин жанындагы тоолуу плато, бир күндүк сейилдөө үчүн ыңгайлуу.",
      en: "Plateau and foothills near Bishkek, ideal for one-day walks.",
    },
    imageUrl: "/images/locations/chunkurchak.jpg",
    difficulty: "easy",
    distanceKm: 5.5,
    elevationGainMeters: 200,
    hasFemaleGuide: true,
    hasEmergencyPoints: true,
  },
];
