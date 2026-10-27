import { Language } from '../../types/language';
import { useSettings } from '../useSettings/useSettings';

export function useLanguage(): Language {
  return useSettings().language;
}
