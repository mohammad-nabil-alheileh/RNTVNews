import { Language } from '../../types/language';

export function formatCountdown(seconds: number, language: Language): string {
  const digits = new Intl.NumberFormat(language, { minimumIntegerDigits: 2 });
  const plain = new Intl.NumberFormat(language);
  return `${plain.format(Math.floor(seconds / 60))}:${digits.format(
    seconds % 60,
  )}`;
}
