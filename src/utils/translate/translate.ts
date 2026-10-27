import { ar } from '../../i18n/ar';
import { en, TranslationKey } from '../../i18n/en';
import { Language } from '../../types/language';

const STRINGS: Record<Language, Record<TranslationKey, string>> = { en, ar };

export type TranslationParams = Record<string, string | number>;

export function translate(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  const text = STRINGS[language][key];
  if (!params) {
    return text;
  }
  const numbers = new Intl.NumberFormat(language);
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = params[name];
    if (value === undefined) {
      return placeholder;
    }
    return typeof value === 'number' ? numbers.format(value) : value;
  });
}
