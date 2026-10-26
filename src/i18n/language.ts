import {createContext, useContext} from 'react';
import {Language, LanguageContextValue} from '../types/language';

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
