"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search, Plus } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface CustomMultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  onAddCustomOption?: (val: string) => void;
  dropUp?: boolean;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Выберите варианты...",
  searchPlaceholder = "Поиск по списку...",
  allowCustom = true,
  onAddCustomOption,
  dropUp = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const toggleOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== val));
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allValues = Array.from(new Set([...selectedValues, ...filteredOptions.map((o) => o.value)]));
    onChange(allValues);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleAddCustom = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    if (!selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed]);
      if (onAddCustomOption) {
        onAddCustomOption(trimmed);
      }
    }
    setSearchQuery("");
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exactMatchExists = options.some(
    (opt) => opt.label.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
            {label}
          </label>
          {selectedValues.length > 0 && (
            <span className="text-[11px] font-bold text-[#07626A] bg-[#07626A]/10 px-2 py-0.5 rounded-md">
              Выбрано: {selectedValues.length}
            </span>
          )}
        </div>
      )}

      {/* Main Trigger Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] px-3 py-1.5 rounded-xl border bg-white flex items-center justify-between gap-2 cursor-pointer transition-all ${
          isOpen
            ? "border-[#07626A] ring-2 ring-[#07626A]/15"
            : "border-[#E1E1E1] hover:border-[#07626A]/50"
        }`}
      >
        <div className="flex flex-wrap gap-1.5 items-center flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-xs text-[#0D0D0D]/40 font-medium py-1">
              {placeholder}
            </span>
          ) : (
            selectedValues.map((val) => {
              const optionObj = options.find((o) => o.value === val);
              const displayLabel = optionObj ? optionObj.label : val;

              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(7,98,106,0.08)] border border-[rgba(7,98,106,0.20)] text-[#07626A] text-xs font-bold transition-all"
                >
                  <span className="truncate max-w-[150px]">{displayLabel}</span>
                  <button
                    type="button"
                    onClick={(e) => removeValue(val, e)}
                    className="hover:bg-[#07626A]/20 rounded-full p-0.5 text-[#07626A] transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#0D0D0D]/50 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#07626A]" : ""
          }`}
        />
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-0 right-0 p-3 rounded-2xl bg-white border border-[#E1E1E1] shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2.5 ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#0D0D0D]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && allowCustom && searchQuery.trim() && !exactMatchExists) {
                  e.preventDefault();
                  handleAddCustom(e as any);
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E1E1E1] bg-[#FAFBFB] text-xs font-medium text-[#0D0D0D] focus:outline-none focus:border-[#07626A] focus:bg-white"
            />
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center justify-between px-1 text-[11px] font-bold text-[#0D0D0D]/60 border-b border-[#E1E1E1] pb-2">
            <span>Варианты ({filteredOptions.length})</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[#07626A] hover:underline cursor-pointer"
              >
                Выбрать все
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-rose-600 hover:underline cursor-pointer"
              >
                Очистить
              </button>
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {filteredOptions.map((opt) => {
              const isChecked = selectedValues.includes(opt.value);

              return (
                <div
                  key={opt.value}
                  onClick={(e) => toggleOption(opt.value, e)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer select-none transition-colors ${
                    isChecked
                      ? "bg-[#07626A]/10 text-[#07626A] font-bold"
                      : "text-[#0D0D0D]/80 hover:bg-[#F3F3F3]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-[#07626A] border-[#07626A] text-white"
                          : "bg-white border-[#C8C8C8]"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-[#0D0D0D]/50 font-normal">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="text-center py-4 text-xs text-[#0D0D0D]/50">
                Ничего не найдено
              </div>
            )}
          </div>

          {/* Add Custom Value Prompt */}
          {allowCustom && searchQuery.trim() && !exactMatchExists && (
            <div className="pt-2 border-t border-[#E1E1E1]">
              <button
                type="button"
                onClick={handleAddCustom}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#07626A] text-white text-xs font-bold hover:bg-[#07626A]/90 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить «{searchQuery.trim()}»</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
