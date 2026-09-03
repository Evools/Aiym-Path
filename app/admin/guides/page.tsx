"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Check,
  ShieldCheck,
  Phone,
  Trash2,
  Edit,
  Globe,
  Award,
  X,
  Save,
  Users,
  MapPin,
  Mountain,
  FileText,
  UserCheck,
  Sparkles,
  MessageSquare,
  Send,
  DollarSign,
  Star,
} from "lucide-react";
import {
  AdminStorageService,
  AdminGuideItem,
  AdminGuideBadge,
} from "@/lib/services/admin-storage.service";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomMultiSelect, MultiSelectOption } from "@/components/ui/CustomMultiSelect";
import { GuideBadgeSelector } from "@/components/features/admin/GuideBadgeSelector";
import { getBadgeIconComponent } from "@/lib/constants/guide-badges";
import { useToast } from "@/context/ToastContext";

const LANGUAGE_OPTIONS: MultiSelectOption[] = [
  { value: "Кыргызча", label: "Кыргызча", sublabel: "Мамлекеттик тил" },
  { value: "Русский", label: "Русский", sublabel: "Официальный язык" },
  { value: "English", label: "English", sublabel: "International" },
  { value: "Deutsch", label: "Deutsch", sublabel: "Немецкий" },
  { value: "Français", label: "Français", sublabel: "Французский" },
  { value: "Türkçe", label: "Türkçe", sublabel: "Турецкий" },
  { value: "Español", label: "Español", sublabel: "Испанский" },
  { value: "Italiano", label: "Italiano", sublabel: "Итальянский" },
  { value: "العربية", label: "العربية (Arabic)", sublabel: "Арабский" },
  { value: "中文", label: "中文 (Chinese)", sublabel: "Китайский" },
  { value: "한국어", label: "한국어 (Korean)", sublabel: "Корейский" },
  { value: "日本語", label: "日本語 (Japanese)", sublabel: "Японский" },
];

const POPULAR_QUICK_LANGS = [
  "Кыргызча",
  "Русский",
  "English",
  "Deutsch",
  "Français",
  "Türkçe",
  "中文",
];

const LOCATION_OPTIONS: MultiSelectOption[] = [
  { value: "Бишкек", label: "Бишкек", sublabel: "Столица и окрестности" },
  { value: "Ала-Арча", label: "Ала-Арча", sublabel: "Национальный парк" },
  { value: "Аламедин", label: "Аламедин", sublabel: "Ущелье и тёплые ключи" },
  { value: "Чункурчак", label: "Чункурчак", sublabel: "Горные панорамы" },
  { value: "Чуй", label: "Чуйская долина", sublabel: "Регион Чуй" },
  { value: "Каракол", label: "Каракол", sublabel: "Хребет Терскей Ала-Тоо" },
  { value: "Ысык-Көл", label: "Ысык-Көл", sublabel: "Озеро Иссык-Куль" },
  { value: "Жеты-Огуз", label: "Жеты-Огуз", sublabel: "Красные скалы" },
  { value: "Нарын", label: "Нарын", sublabel: "Высокогорье" },
  { value: "Сон-Көл", label: "Сон-Көл", sublabel: "Озеро на высоте 3016м" },
  { value: "Кель-Суу", label: "Кель-Суу", sublabel: "Бирюзовое озеро" },
  { value: "Ош", label: "Ош", sublabel: "Южный Кыргызстан" },
  { value: "Сары-Челек", label: "Сары-Челек", sublabel: "Биосферный заповедник" },
  { value: "Арсланбоб", label: "Арсланбоб", sublabel: "Реликтовые ореховые леса" },
];

const POPULAR_LOCATIONS = [
  "Бишкек",
  "Ала-Арча",
  "Чункурчак",
  "Аламедин",
  "Каракол",
  "Ысык-Көл",
  "Нарын",
  "Ош",
];

const SPECIALTY_PRESETS = [
  "Пешие походы (Hiking)",
  "Восхождения (Climbing)",
  "Конные туры",
  "Однодневные туры",
  "Многодневный треккинг",
  "Фототуры & Дрон",
  "Экотуры & Ботаника",
  "Этно-туры & Культура",
  "4x4 Внедорожные туры",
  "Женские соло-группы",
];

const DEFAULT_AVATARS = [
  "/images/guides/guide-2.jpg",
  "/images/guides/guide-3.jpg",
  "/images/guides/guide-1.webp",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
];

export default function AdminGuidesPage() {
  const toast = useToast();
  const [guides, setGuides] = useState<AdminGuideItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingGuide, setEditingGuide] = useState<AdminGuideItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"guide" | "agency">("guide");
  const [role, setRole] = useState({ ru: "", kg: "", en: "" });
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("+996 700 000 000");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [instagram, setInstagram] = useState("");
  const [priceRange, setPriceRange] = useState("от 3 500 сом / день");
  const [experienceYears, setExperienceYears] = useState<number | string>(5);
  const [groupSize, setGroupSize] = useState("1–8 человек");
  const [locations, setLocations] = useState<string[]>(["Бишкек", "Ала-Арча"]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "Кыргызча",
    "Русский",
    "English",
  ]);
  const [specialties, setSpecialties] = useState<string[]>([
    "Пешие походы (Hiking)",
    "Однодневные туры",
  ]);
  const [badges, setBadges] = useState<AdminGuideBadge[]>([]);
  const [skills, setSkills] = useState({
    firstAid: true,
    mountaineer: true,
    mountainGuide: true,
  });
  const [bio, setBio] = useState({ ru: "", kg: "", en: "" });
  const [isFemale, setIsFemale] = useState(true);
  const [isVerified, setIsVerified] = useState(true);

  const loadGuides = async () => {
    const data = await AdminStorageService.getGuides();
    setGuides(data);
  };

  useEffect(() => {
    loadGuides();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const openCreateModal = () => {
    setEditingGuide(null);
    setName("");
    setCategory("guide");
    setRole({
      ru: "Горный гид и инструктор по безопасности",
      kg: "Тоо гиди жана коопсуздук инструктору",
      en: "Mountain Guide & Trekking Safety Lead",
    });
    setImage("/images/guides/guide-2.jpg");
    setPhone("+996 701 112 233");
    setWhatsapp("+996 701 112 233");
    setTelegram("@aiym_guide");
    setInstagram("");
    setPriceRange("от 3 500 сом / день");
    setExperienceYears(5);
    setGroupSize("1–8 человек");
    setLocations(["Бишкек", "Ала-Арча", "Чункурчак"]);
    setSelectedLanguages(["Кыргызча", "Русский", "English"]);
    setSpecialties(["Пешие походы (Hiking)", "Женские соло-группы"]);
    setBadges([
      {
        id: "firstAid",
        icon: "HeartPulse",
        label: {
          ru: "Первая медицинская помощь (WFR)",
          kg: "Биринчи медициналык жардам",
          en: "Wilderness First Aid",
        },
      },
      {
        id: "mountainGuide",
        icon: "Mountain",
        label: {
          ru: "Горный гид (KMGA)",
          kg: "Тоо гиди",
          en: "Certified Mountain Guide",
        },
      },
      {
        id: "femaleSafe",
        icon: "ShieldCheck",
        label: {
          ru: "Female-Friendly Стандарт",
          kg: "Аялдар үчүн коопсуз коштоо",
          en: "Female-Friendly Standard",
        },
      },
    ]);
    setSkills({
      firstAid: true,
      mountaineer: true,
      mountainGuide: true,
    });
    setBio({
      ru: "Профессионально вожу женские группы и индивидуальных путешественниц по ущельям Тянь-Шаня. Особое внимание уделяю безопасности, комфорту и теплой атмосфере в горах.",
      kg: "Тянь-Шань капчыгайларына аялдар топторун жана жеке саякатчыларды профессионалдык деңгээлде алып барам. Коопсуздукка жана тоодогу жагымдуу маанайга өзгөчө көңүл бурам.",
      en: "Professional guide leading female groups and solo travelers across Tien Shan mountains with strong focus on wilderness safety, comfort, and inspiring experience.",
    });
    setIsFemale(true);
    setIsVerified(true);
    setIsModalOpen(true);
  };

  const openEditModal = (guide: AdminGuideItem) => {
    setEditingGuide(guide);
    setName(guide.name);
    setCategory(guide.category || "guide");
    setRole({
      ru: guide.role.ru,
      kg: guide.role.kg || guide.role.ru,
      en: guide.role.en || guide.role.ru,
    });
    setImage(guide.image);
    setPhone(guide.phone || "+996 700 000 000");
    setWhatsapp(guide.whatsapp || guide.phone || "");
    setTelegram(guide.telegram || "");
    setInstagram(guide.instagram || "");
    setPriceRange(guide.priceRange || "от 3 500 сом / день");
    setExperienceYears(guide.experienceYears || 3);
    setGroupSize(guide.groupSize || "1–8 человек");
    setLocations(guide.locations && guide.locations.length > 0 ? guide.locations : ["Бишкек", "Ала-Арча"]);
    setSelectedLanguages(
      guide.languages && guide.languages.length > 0
        ? guide.languages
        : ["Русский", "English"]
    );
    setSpecialties(
      guide.specialties && guide.specialties.length > 0
        ? guide.specialties
        : ["Пешие походы (Hiking)"]
    );
    setBadges(guide.badges || []);
    setSkills(
      guide.skills || {
        firstAid: true,
        mountaineer: true,
        mountainGuide: true,
      }
    );
    setBio(
      guide.bio || {
        ru: "",
        kg: "",
        en: "",
      }
    );
    setIsFemale(guide.isFemale !== undefined ? guide.isFemale : true);
    setIsVerified(guide.isVerified !== undefined ? guide.isVerified : true);
    setIsModalOpen(true);
  };

  const handleToggleQuickLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleToggleQuickLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleToggleSpecialty = (spec: string) => {
    setSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Пожалуйста, введите имя специалиста", "Заполните поле");
      return;
    }

    if (!role.ru.trim()) {
      toast.warning("Пожалуйста, укажите специализацию на русском языке", "Заполните поле");
      return;
    }

    const guideData: AdminGuideItem = {
      id: editingGuide ? editingGuide.id : `guide-${Date.now()}`,
      name,
      category,
      role: {
        ru: role.ru,
        kg: role.kg || role.ru,
        en: role.en || role.ru,
      },
      image: image || "/images/guides/guide-2.jpg",
      phone: phone || "+996 700 000 000",
      whatsapp: whatsapp.trim() || undefined,
      telegram: telegram.trim() || undefined,
      instagram: instagram.trim() || undefined,
      priceRange: priceRange.trim() || undefined,
      experienceYears: Number(experienceYears) || 1,
      groupSize: groupSize || "1–8 человек",
      locations: locations.length > 0 ? locations : ["Бишкек"],
      languages:
        selectedLanguages.length > 0 ? selectedLanguages : ["Русский", "English"],
      specialties,
      badges,
      skills,
      bio,
      isFemale,
      isVerified,
      rating: editingGuide?.rating ?? 5.0,
      reviewsCount: editingGuide?.reviewsCount ?? 14,
    };

    await AdminStorageService.saveGuide(guideData);
    await loadGuides();
    toast.success(
      editingGuide
        ? `Профиль «${name}» обновлен в базе данных`
        : `Специалист «${name}» успешно сохранен в базе данных`
    );
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, guideName: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить специалиста?",
      message: `Вы уверены, что хотите удалить профиль «${guideName}» из базы данных?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      await AdminStorageService.deleteGuide(id);
      await loadGuides();
      toast.success(`Профиль «${guideName}» удален из базы данных`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Гиды и агентства (Female Guides CMS)
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управление профилями проверенных женщин-гидов, компетенциями с иконками, турами и прямыми контактами.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить гида</span>
        </button>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isMounted ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-[#0D0D0D]/40">
            Загрузка списка специалистов из базы данных...
          </div>
        ) : guides.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white border border-[#E1E1E1]">
            <Users className="w-10 h-10 text-[#07626A]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0D0D0D]">Гиды не найдены</h3>
            <p className="text-xs text-[#0D0D0D]/60 mt-1 mb-4">
              Добавьте проверенного женского гида в базу платформы.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07626A] text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Создать первого гида</span>
            </button>
          </div>
        ) : (
          guides.map((guide) => {
            const roleRu = typeof guide.role === "object" ? guide.role.ru : guide.role;
            const badgesCount = guide.badges?.length || 0;

            return (
              <div
                key={guide.id}
                className="rounded-3xl bg-white border border-[#E1E1E1] hover:border-[rgba(7,98,106,0.35)] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Top Row: Avatar & Badges */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#E1E1E1] bg-gray-100">
                      <Image
                        src={guide.image || "/images/guides/guide-2.jpg"}
                        alt={guide.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {guide.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(7,98,106,0.10)] text-[#07626A] text-[10px] font-extrabold uppercase">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Certified</span>
                          </span>
                        )}

                        {guide.isFemale && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                            <span>Female Guide</span>
                          </span>
                        )}

                        {badgesCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{badgesCount} иконок</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#0D0D0D] mt-1 truncate">
                        {guide.name}
                      </h3>
                      <p className="text-xs text-[#07626A] font-medium truncate">
                        {roleRu}
                      </p>
                    </div>
                  </div>

                  {/* Badges Preview Row */}
                  {guide.badges && guide.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-[#E1E1E1]/60">
                      {guide.badges.slice(0, 4).map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F0F4F4] text-[#07626A] text-[10.5px] font-semibold"
                          title={b.label.ru}
                        >
                          {getBadgeIconComponent(b.icon, "w-3 h-3")}
                          <span className="truncate max-w-[110px]">{b.label.ru}</span>
                        </span>
                      ))}
                      {guide.badges.length > 4 && (
                        <span className="text-[10px] font-bold text-gray-400 self-center">
                          +{guide.badges.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E1E1E1] text-xs text-[#0D0D0D]/70">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]/50 block mb-0.5">
                        Локации
                      </span>
                      <span className="font-semibold text-[#0D0D0D] truncate block">
                        {guide.locations?.join(", ") || "Бишкек"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]/50 block mb-0.5">
                        Опыт & Группа
                      </span>
                      <span className="font-bold text-[#0D0D0D]">
                        {guide.experienceYears} лет • {guide.groupSize || "1–8 чел"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E1E1E1]">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${guide.phone?.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#07626A] hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{guide.phone}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(guide.id, guide.name)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(guide)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#07626A] text-[#0D0D0D] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Изменить</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Scalable Modal Dialog */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D0D0D]/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-[#E1E1E1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#E1E1E1] shrink-0 bg-white">
              <div>
                <h3 className="text-lg font-bold text-[#0D0D0D]">
                  {editingGuide
                    ? "Редактирование профиля специалиста"
                    : "Новый женский гид / Агентство"}
                </h3>
                <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
                  Настройка компетенций, иконок, сертификатов, цен и контактов в базе данных.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-[#F3F3F3] text-[#0D0D0D]/60 hover:text-[#0D0D0D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              id="guide-form"
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-6 sm:px-8 flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Personal info, Photo, Verification (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                      Имя и фамилия <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Например: Айсулуу Жумабекова"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-bold text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                    />
                  </div>

                  {/* Category Selection */}
                  <CustomSelect
                    label="Тип профиля"
                    value={category}
                    onChange={(val) => setCategory(val as "guide" | "agency")}
                    options={[
                      {
                        value: "guide",
                        label: "Индивидуальный женский гид",
                        sublabel: "Персональное сопровождение",
                      },
                      {
                        value: "agency",
                        label: "Туристическое агентство / Женский клуб",
                        sublabel: "Групповые туры и комьюнити",
                      },
                    ]}
                  />

                  {/* Photo URL & Avatar Preview */}
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                      URL фотографии профиля
                    </label>
                    <input
                      type="text"
                      required
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="/images/guides/guide-2.jpg или URL..."
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                    />

                    {/* Quick Avatar Presets */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-[#0D0D0D]/50 font-bold uppercase shrink-0">
                        Пресеты:
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {DEFAULT_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImage(av)}
                            className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#E1E1E1] hover:border-[#07626A] shrink-0 cursor-pointer"
                          >
                            <img
                              src={av}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contacts & Price Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+996 700 123 456"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                        WhatsApp (номер)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+996 700 123 456"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                        Telegram (@username)
                      </label>
                      <input
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="@username"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                        Стоимость услуг
                      </label>
                      <input
                        type="text"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        placeholder="от 3 500 сом / день"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                      />
                    </div>
                  </div>

                  {/* Experience & Group Size */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                        Опыт работы (лет)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        required
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-bold text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D]/70 uppercase tracking-wider mb-1.5">
                        Размер группы
                      </label>
                      <input
                        type="text"
                        value={groupSize}
                        onChange={(e) => setGroupSize(e.target.value)}
                        placeholder="1–8 человек"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:bg-white focus:outline-none focus:border-[#07626A]"
                      />
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="p-4 rounded-2xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D0D0D]/60">
                      Статусы доверия
                    </span>

                    <CustomCheckbox
                      checked={isFemale}
                      onChange={setIsFemale}
                      label="Female Guide / Женский специалист"
                      description="Отображать бейдж женщины-гида для безопасности соло-путешественниц"
                    />

                    <CustomCheckbox
                      checked={isVerified}
                      onChange={setIsVerified}
                      label="Верифицированный профиль (Certified)"
                      description="Проверены документы и опыт командой Aiym Path"
                    />
                  </div>
                </div>

                {/* Right Column: Role (i18n), Badges/Icons, Specialties, Bio (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  {/* 1. Multilingual Role / Specialization */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3">
                    <I18nFieldEditor
                      label="Специализация и роль"
                      required
                      value={role}
                      onChange={setRole}
                      placeholder={{
                        ru: "Например: Лицензированный горный гид и спасатель",
                        kg: "Мисалы: Лицензияланган тоо гиди жана куткаруучу",
                        en: "E.g. Certified Mountain Guide & First Responder",
                      }}
                    />
                  </div>

                  {/* 2. Scalable Badge & Icon Selector */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1]">
                    <GuideBadgeSelector
                      selectedBadges={badges}
                      onChange={setBadges}
                    />
                  </div>

                  {/* 3. Tour Specialties Chips */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1] space-y-3">
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Направления туров и форматы
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {SPECIALTY_PRESETS.map((spec) => {
                        const isSelected = specialties.includes(spec);
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => handleToggleSpecialty(spec)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                                : "bg-[#FAFBFB] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A]"
                            }`}
                          >
                            {spec}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Locations Multi-Select */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3">
                    <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Локации и регионы сопровождения
                    </label>

                    <CustomMultiSelect
                      label=""
                      options={LOCATION_OPTIONS}
                      selectedValues={locations}
                      onChange={setLocations}
                      placeholder="Выберите локации (напр: Ала-Арча, Чункурчак, Каракол)..."
                    />

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D0D0D]/50 mr-1">
                        Быстрый выбор:
                      </span>
                      {POPULAR_LOCATIONS.map((loc) => {
                        const isSelected = locations.includes(loc);
                        return (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => handleToggleQuickLocation(loc)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                                : "bg-white text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A] hover:text-[#0D0D0D]"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            <span>{loc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Languages Multi-Select */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1] flex flex-col gap-3">
                    <label className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      Языки общения и туров
                    </label>

                    <CustomMultiSelect
                      label=""
                      options={LANGUAGE_OPTIONS}
                      selectedValues={selectedLanguages}
                      onChange={setSelectedLanguages}
                      placeholder="Выберите языки гида..."
                    />

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D0D0D]/50 mr-1">
                        Популярные:
                      </span>
                      {POPULAR_QUICK_LANGS.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleToggleQuickLanguage(lang)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                                : "bg-white text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A] hover:text-[#0D0D0D]"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. Bio / Philosophy Editor */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E1E1E1]">
                    <I18nFieldEditor
                      label="О себе / Философия сопровождения"
                      isTextarea
                      rows={3}
                      value={bio}
                      onChange={setBio}
                      placeholder={{
                        ru: "Расскажите об опыте, маршрутах и подходе к безопасности...",
                        kg: "Тажрыйбаңыз, каттамдар жана коопсуздукка болгон мамилеңиз тууралуу айтып бериңиз...",
                        en: "Describe your guiding experience, favorite trails, and safety approach...",
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Actions Footer (Fixed at bottom) */}
            <div className="p-4 sm:px-8 border-t border-[#E1E1E1] bg-[#FAFBFB] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E1E1E1] bg-white hover:bg-[#F3F3F3] text-xs font-bold text-[#0D0D0D] transition-colors cursor-pointer"
              >
                Отмена
              </button>

              <button
                type="submit"
                form="guide-form"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>
                  {editingGuide ? "Сохранить изменения" : "Добавить в базу"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
