import { useSyncExternalStore } from 'react';
import { getSession, subscribeSession } from '../../api/sessionStore';
import { SessionState } from '../../types/auth';

export function useSession(): SessionState {
  return useSyncExternalStore(subscribeSession, getSession);
}
