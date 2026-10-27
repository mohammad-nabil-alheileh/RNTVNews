import { KeyboardLayout } from './SearchKeyboard.types';

const DIGITS = '1234567890'.split('');

export const KEYBOARD_LAYOUTS: Record<KeyboardLayout, string[]> = {
  en: [...'abcdefghijklmnopqrstuvwxyz'.split(''), ...DIGITS],
  ar: [...'ابتثجحخدذرزسشصضطظعغفقكلمنهويةىءأ'.split(''), ...DIGITS],
};

export const LAYOUT_SWITCH_LABEL: Record<KeyboardLayout, string> = {
  en: 'عربي',
  ar: 'ABC',
};
