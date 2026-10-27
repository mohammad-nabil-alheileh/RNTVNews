import { useSyncExternalStore } from 'react';
import { getSavedState, subscribeSaved } from '../../api/savedStore';

export function useIsSaved(id: number): boolean {
  return useSyncExternalStore(subscribeSaved, () =>
    getSavedState().items.some(item => item.article.id === id),
  );
}
