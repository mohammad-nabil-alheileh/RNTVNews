import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types/language';
import { SettingsState, TextSize } from '../types/settings';

const STORAGE_KEY = 'settings';

let state: SettingsState = {
  loaded: false,
  language: 'en',
  textSize: 'medium',
};
const listeners = new Set<() => void>();

function update(next: Partial<SettingsState>) {
  state = { ...state, ...next, loaded: true };
  listeners.forEach(listener => listener());
}

function persist() {
  const { language, textSize } = state;
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ language, textSize }),
  ).catch(error => {
    if (__DEV__) {
      console.warn('Saving settings failed', error);
    }
  });
}

export async function loadSettings(): Promise<void> {
  let saved: Partial<SettingsState> = {};
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    saved = raw ? (JSON.parse(raw) as Partial<SettingsState>) : {};
  } catch (error) {
    if (__DEV__) {
      console.warn('Loading settings failed', error);
    }
  }
  update({
    language: saved.language ?? state.language,
    textSize: saved.textSize ?? state.textSize,
  });
}

export function subscribeSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSettings(): SettingsState {
  return state;
}

export function setLanguage(language: Language): void {
  update({ language });
  persist();
}

export function setTextSize(textSize: TextSize): void {
  update({ textSize });
  persist();
}
