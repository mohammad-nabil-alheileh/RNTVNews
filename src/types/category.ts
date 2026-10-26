import {Language} from '../i18n/language';

export interface Category {
  tag: string;
  label: Record<Language, string>;
}
