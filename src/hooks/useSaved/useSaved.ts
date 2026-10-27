import { useSyncExternalStore } from 'react';
import { getSavedState, subscribeSaved } from '../../api/savedStore';
import { SavedState } from '../../types/saved';

export function useSaved(): SavedState {
  return useSyncExternalStore(subscribeSaved, getSavedState);
}
