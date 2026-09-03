"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  ShieldCheck,
  Building2,
  Trash2,
  Edit,
  X,
  Save,
  MapPin,
  Wifi,
  Phone,
  Sparkles,
  Check,
  Layers,
  Sparkle,
} from "lucide-react";
import {
  AdminStorageService,
  AdminLocationItem,
} from "@/lib/services/admin-storage.service";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { LocationMapPickerWrapper } from "@/components/features/admin/LocationMapPickerWrapper";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useToast } from "@/context/ToastContext";

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
];

const POPULAR_AMENITIES = [
  "Охрана 24/7",
  "Wi-Fi",
  "Женский персонал",
  "Тёплые домики",
  "Горячий душ",
  "Прокат снаряжения",
  "Медпункт / SOS",
  "Кафе / Питание",
];

export default function AdminLocationsPage() {
  const toast = useToast();
  const [locations, setLocations] = useState<AdminLocationItem[]>([]);
  const [editingLoc, setEditingLoc] = useState<AdminLocationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState({ ru: "", kg: "", en: "" });
  const [description, setDescription] = useState({ ru: "", kg: "", en: "" });
  const [type, setType] = useState<AdminLocationItem["type"]>("hotel");
  const [image, setImage] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([42.6389, 74.6281]);
  const [phone, setPhone] = useState("+996 700 000 000");
  const [amenitiesList, setAmenitiesList] = useState<string[]>([
    "Охрана 24/7",
    "Wi-Fi",
    "Женский персонал",
  ]);

  const loadLocations = async () => {
    const data = await AdminStorageService.getLocations();
    setLocations(data);
  };

  useEffect(() => {
    loadLocations();
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

  const handleCoordinatesChange = useCallback((newCoords: [number, number]) => {
    setCoordinates(newCoords);
  }, []);

  const openCreateModal = () => {
    setEditingLoc(null);
    setTitle({
      ru: "Эко-резорт Чункурчак",
      kg: "Чүңкүрчак эко-резорту",
      en: "Chunkurchak Eco-Resort",
    });
    setDescription({
      ru: "Проверенная база отдыха с круглосуточной охраной, женскими шале и прокатом снаряжения.",
      kg: "Түнү бою күзөт кызматы, аялдар шалеси жана шаймандарды ижарага берүүчү эс алуу базасы.",
      en: "Verified mountain resort with 24/7 security, female-friendly chalets and gear rental.",
    });
    setType("hotel");
    setImage("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80");
    setCoordinates([42.6389, 74.6281]);
    setPhone("+996 700 000 000");
    setAmenitiesList(["Охрана 24/7", "Wi-Fi", "Тёплые домики", "Женский персонал"]);
    setIsModalOpen(true);
  };

  const openEditModal = (loc: AdminLocationItem) => {
    setEditingLoc(loc);
    setTitle({
      ru: loc.title.ru,
      kg: loc.title.kg || loc.title.ru,
      en: loc.title.en || loc.title.ru,
    });
    setDescription({
      ru: loc.description.ru,
      kg: loc.description.kg || loc.description.ru,
      en: loc.description.en || loc.description.ru,
    });
    setType(loc.type);
    setImage(loc.image);
    setCoordinates(loc.coordinates || [42.6389, 74.6281]);
    setPhone(loc.phone || "+996 700 000 000");
    setAmenitiesList(
      loc.amenities && loc.amenities.length > 0
        ? loc.amenities
        : ["Охрана 24/7", "Wi-Fi"]
    );
    setIsModalOpen(true);
  };

  const handleToggleAmenity = (amenity: string) => {
    setAmenitiesList((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.ru.trim()) {
      toast.warning("Введите название локации на русском языке", "Заполните поле");
      return;
    }

    const locData: AdminLocationItem = {
      id: editingLoc ? editingLoc.id : `loc-${Date.now()}`,
      title,
      description,
      type,
      image: image || PRESET_IMAGES[0],
      coordinates: coordinates,
      phone,
      amenities: amenitiesList.length > 0 ? amenitiesList : ["Wi-Fi", "Охрана 24/7"],
    };

    await AdminStorageService.saveLocation(locData);
    await loadLocations();
    toast.success(
      editingLoc
        ? `Локация «${title.ru}» обновлена в базе данных`
        : `Локация «${title.ru}» успешно добавлена в базу данных`
    );
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить локацию?",
      message: `Вы уверены, что хотите удалить локацию «${name}» из базы данных?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      await AdminStorageService.deleteLocation(id);
      await loadLocations();
      toast.success(`Локация «${name}» удалена из базы данных`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E1E1]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            Базы отдыха & Хабы безопасности
          </h1>
          <p className="text-xs sm:text-sm text-[#0D0D0D]/65 mt-1">
            Управление проверенными female-friendly отелями, лагерями и точками помощи с интерактивной картой.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить локацию</span>
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((loc) => {
          return (
            <div
              key={loc.id}
              className="p-5 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between gap-4 shadow-2xs"
            >
              <div>
                <div className="relative h-40 rounded-2xl bg-[#F3F3F3] overflow-hidden border border-[#E1E1E1] mb-3.5">
                  <Image
                    src={loc.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"}
                    alt={loc.title.ru}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#07626A] text-[10px] font-bold uppercase shadow-2xs">
                    {loc.type === "hotel"
                      ? "Отель / Резорт"
                      : loc.type === "camp"
                      ? "Лагерь / Юрты"
                      : "Хаб безопасности"}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#0D0D0D] line-clamp-1">
                  {loc.title.ru}
                </h3>
                <p className="text-xs text-[#0D0D0D]/65 line-clamp-2 mt-1 font-medium leading-relaxed">
                  {loc.description.ru}
                </p>

                {/* Amenities Badges */}
                {loc.amenities && loc.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {loc.amenities.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#F3F3F3] text-[10px] font-medium text-[#0D0D0D]/75"
                      >
                        {a}
                      </span>
                    ))}
                    {loc.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#F3F3F3] text-[10px] font-bold text-[#07626A]">
                        +{loc.amenities.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Coordinates & Contact */}
                <div className="mt-3 pt-3 border-t border-[#E1E1E1] text-xs space-y-1.5 text-[#0D0D0D]/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#07626A]" />
                      <span>Координаты на карте</span>
                    </span>
                    <span className="font-mono font-bold text-[11px] text-[#07626A] bg-[#07626A]/10 px-2 py-0.5 rounded-md">
                      {loc.coordinates[0]}, {loc.coordinates[1]}
                    </span>
                  </div>

                  {loc.phone && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#07626A]" />
                        <span>Контакты</span>
                      </span>
                      <span className="font-bold text-[#0D0D0D] font-mono text-[11px]">
                        {loc.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E1E1E1]">
                <button
                  type="button"
                  onClick={() => handleDelete(loc.id, loc.title.ru)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                  title="Удалить локацию"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(loc)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#07626A] text-[#0D0D0D] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Изменить</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra-Wide Modal Dialog with Divided Categories */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-white rounded-3xl border border-[#E1E1E1] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] cursor-default"
          >
            {/* Modal Header (Fixed Top) */}
            <div className="flex items-center justify-between p-6 sm:px-8 border-b border-[#E1E1E1] shrink-0 bg-white">
              <div>
                <h3 className="text-lg font-bold text-[#0D0D0D]">
                  {editingLoc ? "Редактирование локации" : "Новая база отдыха / Безопасный хаб"}
                </h3>
                <p className="text-xs text-[#0D0D0D]/60 mt-0.5">
                  Заполните информацию по блокам и укажите точное местоположение на карте.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form with Categorized Sections (Scrollable Middle) */}
            <form id="location-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:px-8 flex flex-col gap-6">
              
              {/* Category Card 1: Main Info & Multilingual Description */}
              <div className="p-6 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-5">
                <div className="pb-3 border-b border-[#E1E1E1]">
                  <h4 className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                    1. Название и описание объекта
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <I18nFieldEditor
                    label="Название базы / отеля"
                    required
                    value={title}
                    onChange={setTitle}
                    placeholder={{
                      ru: "Например: Эко-резорт Чункурчак",
                      kg: "Мисалы: Чүңкүрчак эко-резорту",
                      en: "E.g. Chunkurchak Eco-Resort",
                    }}
                  />

                  <I18nFieldEditor
                    label="Описание инфраструктуры и безопасности"
                    isTextarea
                    rows={3}
                    value={description}
                    onChange={setDescription}
                    placeholder={{
                      ru: "Опишите безопасность, условия проживания, удобства...",
                      kg: "Коопсуздукту, жашоо шарттарын жана ыңгайлуулуктарды жазыңыз...",
                      en: "Describe security features, amenities and stay conditions...",
                    }}
                  />
                </div>
              </div>

              {/* Category Card 2: Object Parameters, Contacts & Amenities */}
              <div className="p-6 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-5">
                <div className="pb-3 border-b border-[#E1E1E1]">
                  <h4 className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                    2. Параметры объекта, фото и удобства
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Type, Phone, Photo */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CustomSelect
                        label="Тип объекта"
                        value={type}
                        onChange={(val) => setType(val as AdminLocationItem["type"])}
                        options={[
                          { value: "hotel", label: "Отель / Резорт", sublabel: "Номера и шале" },
                          { value: "camp", label: "Лагерь / Юрты", sublabel: "Кемпинг и глэмпинг" },
                          { value: "hub", label: "Хаб безопасности", sublabel: "Медпункт и укрытие" },
                        ]}
                      />

                      <div>
                        <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">
                          Телефон администрации
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+996 700 123 456"
                          className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                        />
                      </div>
                    </div>

                    {/* Photo URL & Presets */}
                    <div>
                      <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                        URL Фотографии
                      </label>
                      <input
                        type="url"
                        required
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                      />

                      {/* Presets */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-[#0D0D0D]/50 font-bold uppercase shrink-0">
                          Пресеты фото:
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                          {PRESET_IMAGES.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setImage(img)}
                              className="relative w-10 h-7 rounded-lg overflow-hidden border border-[#E1E1E1] hover:border-[#07626A] shrink-0 cursor-pointer"
                            >
                              <img src={img} alt="preset" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amenities / Badges */}
                  <div className="lg:col-span-6 flex flex-col gap-2 p-4 rounded-2xl bg-white border border-[#E1E1E1]">
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1">
                      Удобства и сервисы безопасности
                    </label>
                    <p className="text-[11px] text-[#0D0D0D]/60 mb-2">
                      Отметьте сервисы, доступные путешественницам на данной локации:
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_AMENITIES.map((amenity) => {
                        const isSelected = amenitiesList.includes(amenity);

                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleToggleAmenity(amenity)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#07626A] text-white border-[#07626A] shadow-xs"
                                : "bg-[#FAFBFB] text-[#0D0D0D]/75 border-[#E1E1E1] hover:border-[#07626A] hover:text-[#0D0D0D]"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            <span>{amenity}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Card 3: Full-Width Map Studio */}
              <div className="p-6 rounded-3xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#07626A]" />
                    <h4 className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
                      3. Интерактивная карта и расположение (OpenStreetMap)
                    </h4>
                  </div>

                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold">
                    Поиск & Клик по карте
                  </span>
                </div>

                <p className="text-xs text-[#0D0D0D]/60 -mt-1">
                  Найдите локацию через поиск, выберите популярную базу или кликните в любую точку карты — координаты определятся автоматически.
                </p>

                {/* Full Width Map Component */}
                <LocationMapPickerWrapper
                  coordinates={coordinates}
                  onSelectCoordinates={handleCoordinatesChange}
                  locationName={title.ru}
                />
              </div>
            </form>

            {/* Modal Footer (Fixed at the very bottom) */}
            <div className="p-4 sm:px-8 border-t border-[#E1E1E1] bg-[#FAFBFB] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                form="location-form"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{editingLoc ? "Сохранить изменения" : "Создать объект"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
