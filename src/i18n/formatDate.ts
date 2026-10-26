import {Language} from './language';

export function formatShortDate(iso: string, language: Language): string {
  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
}
