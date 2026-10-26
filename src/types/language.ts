export type Language = 'en' | 'ar';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}
