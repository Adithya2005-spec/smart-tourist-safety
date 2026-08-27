import en from "../locales/en.json";
import hi from "../locales/hi.json";
import kn from "../locales/kn.json";
import { Language } from "../contexts/SafetyContext";

const translations: Record<Language, Record<string, string>> = {
  en,
  hi,
  kn,
};

export function t(key: string, lang: Language = "en"): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
