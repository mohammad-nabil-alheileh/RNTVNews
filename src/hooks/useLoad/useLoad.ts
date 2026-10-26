import {useCallback, useEffect, useState} from 'react';
import {ApiError} from '../../api/devto';
import {LoadState} from '../../types/story';

export function useLoad<T>(load: () => Promise<T>) {
  const [state, setState] = useState<LoadState<T>>({status: 'loading'});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({status: 'loading'});

    load().then(
      data => {
        if (active) {
          setState({status: 'success', data});
        }
      },
      (error: unknown) => {
        if (!active) {
          return;
        }
        if (error instanceof ApiError && error.kind === 'offline') {
          setState({status: 'offline'});
        } else {
          const message = error instanceof Error ? error.message : String(error);
          setState({status: 'error', error: message});
        }
      },
    );

    return () => {
      active = false;
    };
  }, [load, attempt]);

  const reload = useCallback(() => setAttempt(n => n + 1), []);

  return {state, reload};
}
