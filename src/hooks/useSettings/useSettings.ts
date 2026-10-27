import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings } from '../../api/settingsStore';
import { SettingsState } from '../../types/settings';

export function useSettings(): SettingsState {
  return useSyncExternalStore(subscribeSettings, getSettings);
}
