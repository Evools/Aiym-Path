"use client";

import React, { createContext, useContext, useMemo, useSyncExternalStore, useCallback } from "react";
import ruDict from "@/locales/ru.json";
import kgDict from "@/locales/kg.json";
import enDict from "@/locales/en.json";

export type Language = "ru" | "kg" | "en";
export type TranslationSchema = typeof ruDict;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: TranslationSchema;
}

const dictionaries: Record<Language, TranslationSchema> = {
  ru: ruDict,
  kg: kgDict,
  en: enDict,
};

const STORAGE_KEY = "aiym_path_lang";
const LANG_CHANGE_EVENT = "aiym_path_lang_change";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(LANG_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(LANG_CHANGE_EVENT, handler);
  };
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "ru";
  try {
    const val = localStorage.getItem(STORAGE_KEY) as Language;
    if (val === "ru" || val === "kg" || val === "en") {
      return val;
    }
  } catch {
    // fallback on error
  }
  return "ru";
}

function getServerSnapshot(): Language {
  return "ru";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      window.dispatchEvent(new Event(LANG_CHANGE_EVENT));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const dict = useMemo(() => dictionaries[language] || ruDict, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dict,
    }),
    [language, setLanguage, dict]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
