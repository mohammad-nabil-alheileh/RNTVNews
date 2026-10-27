import { useCallback, useEffect, useState } from 'react';
import {
  completeSignIn,
  createSignInCode,
  isApproved,
  POLL_INTERVAL_MS,
} from '../../api/auth';
import { PhoneSignInState } from '../../types/auth';

export function usePhoneSignIn() {
  const [state, setState] = useState<PhoneSignInState>(() => ({
    ...createSignInCode(),
    connectionProblem: false,
  }));

  const newCode = useCallback((notice?: 'expired') => {
    setState({ ...createSignInCode(), notice, connectionProblem: false });
  }, []);

  const { code, expiresAt } = state;

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      if (Date.now() > expiresAt) {
        newCode('expired');
        return;
      }
      try {
        const approved = await isApproved(code);
        if (!active) {
          return;
        }
        if (approved) {
          completeSignIn();
          return;
        }
        setState(current =>
          current.connectionProblem
            ? { ...current, connectionProblem: false }
            : current,
        );
      } catch {
        if (!active) {
          return;
        }
        setState(current =>
          current.connectionProblem
            ? current
            : { ...current, connectionProblem: true },
        );
      }
      timer = setTimeout(check, POLL_INTERVAL_MS);
    };
    timer = setTimeout(check, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [code, expiresAt, newCode]);

  return { state, newCode };
}
