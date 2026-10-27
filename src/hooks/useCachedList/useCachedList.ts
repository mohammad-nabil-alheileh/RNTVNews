import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  fetchList,
  getCachedList,
  isListFresh,
  subscribeList,
} from '../../api/listCache';
import { LoadState, Story } from '../../types/story';
import { failureState } from '../../utils/failureState/failureState';
import { useListCacheReady } from '../useListCacheReady/useListCacheReady';
import { useOnRecovery } from '../useOnRecovery/useOnRecovery';

export function useCachedList(key: string, fetcher: () => Promise<Story[]>) {
  const ready = useListCacheReady();
  const subscribe = useCallback(
    (listener: () => void) => subscribeList(key, listener),
    [key],
  );
  const cached = useSyncExternalStore(subscribe, () => getCachedList(key));
  const [failure, setFailure] = useState<LoadState<Story[]> | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!ready || isListFresh(key)) {
      return;
    }
    let active = true;
    setFailure(null);
    fetchList(key, fetcher).catch(error => {
      if (active) {
        setFailure(failureState<Story[]>(error));
      }
    });
    return () => {
      active = false;
    };
  }, [ready, key, fetcher, attempt]);

  const reload = useCallback(() => setAttempt(n => n + 1), []);

  useOnRecovery(() => {
    if (!isListFresh(key)) {
      reload();
    }
  });

  let state: LoadState<Story[]>;
  if (cached) {
    state = { status: 'success', data: cached };
  } else {
    state = failure ?? { status: 'loading' };
  }
  return { state, reload };
}
