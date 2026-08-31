"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  AdminStorageService,
  AdminLocationItem,
} from "@/lib/services/admin-storage.service";
import { I18nFieldEditor } from "@/components/features/admin/I18nFieldEditor";
import { useToast } from "@/context/ToastContext";

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
  const [lat, setLat] = useState(42.5644);
  const [lng, setLng] = useState(74.4823);
  const [phone, setPhone] = useState("+996 700 000 000");
  const [amenitiesStr, setAmenitiesStr] = useState("Охрана 24/7, Wi-Fi, Тёплые домики, Женский персонал");

  useEffect(() => {
    setLocations(AdminStorageService.getLocations());
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
    setLat(42.6389);
    setLng(74.6281);
    setPhone("+996 700 000 000");
    setAmenitiesStr("Охрана 24/7, Wi-Fi, Тёплые домики, Женский персонал");
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
    setLat(loc.coordinates[0]);
    setLng(loc.coordinates[1]);
    setPhone(loc.phone || "+996 700 000 000");
    setAmenitiesStr(loc.amenities ? loc.amenities.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.ru.trim()) {
      toast.warning("Введите название локации", "Заполните поле");
      return;
    }

    const amenities = amenitiesStr
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const locData: AdminLocationItem = {
      id: editingLoc ? editingLoc.id : `loc-${Date.now()}`,
      title,
      description,
      type,
      image,
      coordinates: [Number(lat), Number(lng)],
      phone,
      amenities: amenities.length > 0 ? amenities : ["Wi-Fi", "Охрана 24/7"],
    };

    AdminStorageService.saveLocation(locData);
    setLocations(AdminStorageService.getLocations());
    toast.success(editingLoc ? `Локация «${title.ru}» обновлена` : `Локация «${title.ru}» создана`);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await toast.confirm({
      title: "Удалить локацию?",
      message: `Вы уверены, что хотите удалить локацию «${name}»?`,
      confirmText: "Удалить",
      cancelText: "Отмена",
      isDestructive: true,
    });

    if (isConfirmed) {
      AdminStorageService.deleteLocation(id);
      setLocations(AdminStorageService.getLocations());
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
            Управление проверенными female-friendly отелями, лагерями и точками помощи.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
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
              className="p-5 rounded-3xl bg-white border border-[#E1E1E1] hover:border-[#07626A] transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="relative h-36 rounded-2xl bg-[#F3F3F3] overflow-hidden border border-[#E1E1E1] mb-3.5">
                  <Image
                    src={loc.image}
                    alt={loc.title.ru}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#07626A] text-[10px] font-bold uppercase shadow-2xs">
                    {loc.type === "hotel" ? "Отель / Резорт" : loc.type === "camp" ? "Лагерь / Юрты" : "Хаб безопасности"}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#0D0D0D] line-clamp-1">
                  {loc.title.ru}
                </h3>
                <p className="text-xs text-[#0D0D0D]/65 line-clamp-2 mt-1">
                  {loc.description.ru}
                </p>

                {/* Coordinates & Contact */}
                <div className="mt-3 pt-3 border-t border-[#E1E1E1] text-xs space-y-1.5 text-[#0D0D0D]/70">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#07626A]" />
                      <span>Координаты GPS</span>
                    </span>
                    <span className="font-mono font-bold text-[11px]">
                      {loc.coordinates[0]}, {loc.coordinates[1]}
                    </span>
                  </div>

                  {loc.phone && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E1E1] shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E1E1]">
              <h3 className="text-lg font-bold text-[#0D0D0D]">
                {editingLoc ? "Редактирование локации" : "Новая база отдыха"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#0D0D0D]/50 hover:text-[#0D0D0D] hover:bg-[#F3F3F3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <I18nFieldEditor
                label="Название базы / отеля"
                required
                value={title}
                onChange={setTitle}
              />

              <I18nFieldEditor
                label="Описание инфраструктуры"
                isTextarea
                rows={3}
                value={description}
                onChange={setDescription}
              />

              {/* Type & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Тип объекта
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AdminLocationItem["type"])}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  >
                    <option value="hotel">Отель / Резорт</option>
                    <option value="camp">Лагерь / Глэмпинг</option>
                    <option value="hub">Хаб безопасности</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Телефон администрации
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Широта (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                    Долгота (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                  />
                </div>
              </div>

              {/* Photo & Amenities */}
              <div>
                <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                  URL Фотографии
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-1.5">
                  Удобства и безопасность (через запятую)
                </label>
                <input
                  type="text"
                  value={amenitiesStr}
                  onChange={(e) => setAmenitiesStr(e.target.value)}
                  placeholder="Охрана 24/7, Wi-Fi, Женский персонал"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E1E1E1] bg-white text-xs font-bold text-[#0D0D0D] focus:outline-none focus:border-[#07626A]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E1E1E1] text-xs font-bold text-[#0D0D0D] hover:bg-[#F3F3F3]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#07626A] hover:bg-[#07626A]/90 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить объект</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
