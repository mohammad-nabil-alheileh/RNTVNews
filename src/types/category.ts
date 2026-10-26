import { Language } from './language';

export interface Category {
  tag: string;
  label: Record<Language, string>;
}
