import { useSyncExternalStore } from 'react';
import { isListCacheReady, subscribeListCacheReady } from '../../api/listCache';

export function useListCacheReady(): boolean {
  return useSyncExternalStore(subscribeListCacheReady, isListCacheReady);
}
