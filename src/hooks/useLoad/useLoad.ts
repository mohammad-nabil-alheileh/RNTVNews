import { useCallback, useEffect, useState } from 'react';
import { LoadState } from '../../types/story';
import { failureState } from '../../utils/failureState/failureState';
import { useOnRecovery } from '../useOnRecovery/useOnRecovery';

export function useLoad<T>(load: () => Promise<T>) {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    load().then(
      data => {
        if (active) {
          setState({ status: 'success', data });
        }
      },
      (error: unknown) => {
        if (active) {
          setState(failureState(error));
        }
      },
    );

    return () => {
      active = false;
    };
  }, [load, attempt]);

  const reload = useCallback(() => setAttempt(n => n + 1), []);

  useOnRecovery(() => {
    if (state.status === 'offline' || state.status === 'error') {
      reload();
    }
  });

  return { state, reload };
}
