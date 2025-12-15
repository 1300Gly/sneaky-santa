import { writable, derived, type Readable } from 'svelte/store';
import type { Language, Translations } from './types';
import nlTranslations from './locales/nl.json';
import enTranslations from './locales/en.json';

const translations: Record<Language, Translations> = {
  nl: nlTranslations,
  en: enTranslations,
};

// Language store
const languageStore = writable<Language>('nl');

// Get nested translation value
function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return path if translation not found
    }
  }
  
  return typeof value === 'string' ? value : path;
}

// Translation function
export function t(key: string, lang?: Language): string {
  const currentLang = lang || get(languageStore);
  const translation = translations[currentLang];
  return getNestedValue(translation, key);
}

// Reactive translation store
export const translate: Readable<(key: string) => string> = derived(
  languageStore,
  (lang) => (key: string) => t(key, lang)
);

// Language management
export function setLanguage(lang: Language): void {
  languageStore.set(lang);
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('pass-the-present:language', lang);
  }
}

export function getLanguage(): Language {
  return get(languageStore);
}

// Initialize language from localStorage
if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('pass-the-present:language') as Language | null;
  if (savedLang && (savedLang === 'nl' || savedLang === 'en')) {
    languageStore.set(savedLang);
  }
}

// Export language store for reactivity
export { languageStore };

// Helper to get store value (for use outside Svelte components)
import { get } from 'svelte/store';

