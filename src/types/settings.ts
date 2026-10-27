import { Language } from './language';

export type TextSize = 'small' | 'medium' | 'large' | 'extraLarge';

export interface SettingsState {
  loaded: boolean;
  language: Language;
  textSize: TextSize;
}
