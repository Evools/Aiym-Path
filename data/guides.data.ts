export interface GuideItem {
  id: number;
  name: string;
  image: string;
  locations: string[];
  phone: string;
  category: "guide" | "agency";
  isFemale: boolean;
  isVerified: boolean;
}

export const INITIAL_GUIDES: GuideItem[] = [
  {
    id: 1,
    name: "Айсулуу Жумабекова",
    image: "/images/guides/guide-2.jpg",
    locations: ["Бишкек", "Ала-Арча", "Чуй"],
    phone: "+996 701 112 233",
    category: "guide",
    isFemale: true,
    isVerified: true,
  },
  {
    id: 2,
    name: "Наргиза Касымова",
    image: "/images/guides/guide-3.jpg",
    locations: ["Каракол", "Ысык-Көл", "Жеты-Огуз"],
    phone: "+996 555 443 322",
    category: "guide",
    isFemale: true,
    isVerified: true,
  },
  {
    id: 3,
    name: "Алина Таалайбекова",
    image: "/images/guides/guide-2.jpg",
    locations: ["Бишкек", "Чункурчак", "Аламедин"],
    phone: "+996 770 998 877",
    category: "guide",
    isFemale: true,
    isVerified: true,
  },
  {
    id: 4,
    name: "Гульмира Токтогулова",
    image: "/images/guides/guide-2.jpg",
    locations: ["Ош", "Сары-Челек", "Арсланбоб"],
    phone: "+996 700 998 877",
    category: "agency",
    isFemale: true,
    isVerified: true,
  },
  {
    id: 5,
    name: "Эльмира Асанова",
    image: "/images/guides/guide-3.jpg",
    locations: ["Ош", "Сары-Челек", "Арсланбоб"],
    phone: "+996 500 123 456",
    category: "agency",
    isFemale: true,
    isVerified: true,
  },
];
