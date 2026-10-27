import { useSyncExternalStore } from 'react';
import { getConnection, subscribeConnection } from '../../api/connection';
import { ConnectionState } from '../../types/connection';

export function useConnection(): ConnectionState {
  return useSyncExternalStore(subscribeConnection, getConnection);
}
