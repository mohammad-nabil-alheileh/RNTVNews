import { useSyncExternalStore } from 'react';
import {
  getListGeneration,
  subscribeListGeneration,
} from '../../api/listCache';

export function useListGeneration(): number {
  return useSyncExternalStore(subscribeListGeneration, getListGeneration);
}
