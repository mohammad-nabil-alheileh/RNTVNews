import { useCallback } from 'react';
import { TranslationKey } from '../../i18n/en';
import { translate, TranslationParams } from '../../utils/translate/translate';
import { useLanguage } from '../useLanguage/useLanguage';

export function useTranslation() {
  const language = useLanguage();
  return useCallback(
    (key: TranslationKey, params?: TranslationParams) =>
      translate(language, key, params),
    [language],
  );
}
