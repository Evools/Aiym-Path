"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Plus, Sparkles, Loader2, X } from "lucide-react";
import {
  AdminStorageService,
  AdminRegionItem,
} from "@/lib/services/admin-storage.service";
import { useToast } from "@/context/ToastContext";

interface RegionSelectWithAddProps {
  value: string;
  onChange: (regionId: string) => void;
  label?: string;
}

export const RegionSelectWithAdd: React.FC<RegionSelectWithAddProps> = ({
  value,
  onChange,
  label = "Регион / Ущелье",
}) => {
  const toast = useToast();
  const [regions, setRegions] = useState<AdminRegionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New region modal/popover state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRegionRu, setNewRegionRu] = useState("");
  const [newRegionKg, setNewRegionKg] = useState("");
  const [newRegionEn, setNewRegionEn] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const loadRegions = async () => {
    const data = await AdminStorageService.getRegions();
    setRegions(data);
  };

  useEffect(() => {
    loadRegions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRegion = regions.find((r) => r.id === value);

  // Auto-translation
  const handleAutoTranslate = async () => {
    if (!newRegionRu.trim()) {
      toast.warning("Введите название региона на русском для автоперевода");
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newRegionRu }),
      });
      const data = await res.json();
      if (data.success || data.en || data.kg) {
        setNewRegionKg(data.kg || newRegionRu);
        setNewRegionEn(data.en || newRegionRu);
        toast.success("Автоперевод выполнен");
      } else {
        toast.error("Не удалось выполнить автоперевод");
      }
    } catch {
      toast.error("Не удалось выполнить автоперевод");
    } finally {
      setIsTranslating(false);
    }
  };

  // Save new custom region
  const handleSaveNewRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionRu.trim()) {
      toast.warning("Введите название региона");
      return;
    }

    // Generate slug id from English or Russian translit
    const idSlug =
      newRegionEn
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `region-${Date.now()}`;

    const newRegion: AdminRegionItem = {
      id: idSlug,
      label: {
        ru: newRegionRu.trim(),
        kg: newRegionKg.trim() || newRegionRu.trim(),
        en: newRegionEn.trim() || newRegionRu.trim(),
      },
    };

    await AdminStorageService.saveRegion(newRegion);
    await loadRegions();
    onChange(newRegion.id);
    toast.success(`Регион «${newRegion.label.ru}» успешно добавлен в базу данных`);

    // Reset and close
    setNewRegionRu("");
    setNewRegionKg("");
    setNewRegionEn("");
    setIsAddingNew(false);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-3.5 rounded-xl border bg-white flex items-center justify-between text-xs font-bold text-[#0D0D0D] transition-colors cursor-pointer ${
          isOpen
            ? "border-[#07626A] ring-1 ring-[#07626A]/20"
            : "border-[#E1E1E1] hover:border-[rgba(7,98,106,0.30)]"
        }`}
      >
        <span className="truncate">
          {selectedRegion ? selectedRegion.label.ru : "Выберите ущелье / регион..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#0D0D0D]/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#07626A]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 p-1.5 rounded-2xl bg-white border border-[#E1E1E1] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1 max-h-72 overflow-y-auto">
          {regions.map((reg) => {
            const isSelected = reg.id === value;

            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  onChange(reg.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[rgba(7,98,106,0.08)] text-[#07626A] font-bold border border-[rgba(7,98,106,0.15)]"
                    : "text-[#0D0D0D]/80 hover:bg-[#F3F3F3] hover:text-[#0D0D0D] border border-transparent"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{reg.label.ru}</span>
                  {reg.label.en && (
                    <span className="text-[10px] text-[#0D0D0D]/50 font-normal">
                      {reg.label.kg} • {reg.label.en}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#07626A] shrink-0 ml-2" />
                )}
              </button>
            );
          })}

          {/* Add New Region Button */}
          {!isAddingNew && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingNew(true);
              }}
              className="w-full mt-1 p-2.5 rounded-xl border border-dashed border-[#07626A]/40 bg-[#07626A]/5 hover:bg-[#07626A]/10 text-xs font-bold text-[#07626A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить новое ущелье / регион</span>
            </button>
          )}

          {/* Inline Add Form */}
          {isAddingNew && (
            <div className="mt-1 p-3 rounded-xl bg-[#FAFBFB] border border-[#E1E1E1] flex flex-col gap-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#0D0D0D] uppercase tracking-wider">
                  Новый регион
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="p-1 rounded-lg hover:bg-black/5 text-[#0D0D0D]/50 hover:text-[#0D0D0D] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={newRegionRu}
                  onChange={(e) => setNewRegionRu(e.target.value)}
                  placeholder="Название на русском (напр: Ущелье Кегети)"
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#E1E1E1] bg-white text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newRegionKg}
                  onChange={(e) => setNewRegionKg(e.target.value)}
                  placeholder="Кыргызча"
                  className="w-full h-8 px-2 text-xs rounded-lg border border-[#E1E1E1] bg-white text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                />
                <input
                  type="text"
                  value={newRegionEn}
                  onChange={(e) => setNewRegionEn(e.target.value)}
                  placeholder="English"
                  className="w-full h-8 px-2 text-xs rounded-lg border border-[#E1E1E1] bg-white text-[#0D0D0D] focus:border-[#07626A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || !newRegionRu.trim()}
                  className="px-2 py-1 rounded-lg bg-white border border-[#E1E1E1] hover:border-[#07626A] text-[10px] font-bold text-[#07626A] transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  {isTranslating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Автоперевод</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveNewRegion}
                  disabled={!newRegionRu.trim()}
                  className="px-3 py-1 rounded-lg bg-[#07626A] text-white text-[11px] font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Сохранить
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
