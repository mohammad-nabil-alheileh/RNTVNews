import {createContext, useContext} from 'react';

export type Language = 'en' | 'ar';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
});

export function useLanguage(): Language {
  return useContext(LanguageContext).language;
}

export function useSetLanguage(): (language: Language) => void {
  return useContext(LanguageContext).setLanguage;
}
