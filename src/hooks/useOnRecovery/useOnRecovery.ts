import { useEffect, useRef } from 'react';
import { useConnection } from '../useConnection/useConnection';

export function useOnRecovery(action: () => void): void {
  const { recoveries } = useConnection();
  const handled = useRef(recoveries);
  const latestAction = useRef(action);

  useEffect(() => {
    latestAction.current = action;
  });

  useEffect(() => {
    if (recoveries === handled.current) {
      return;
    }
    handled.current = recoveries;
    latestAction.current();
  }, [recoveries]);
}
