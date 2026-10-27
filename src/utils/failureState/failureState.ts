import { ApiError } from '../../api/devto';
import { LoadState } from '../../types/story';

export function failureState<T>(error: unknown): LoadState<T> {
  if (error instanceof ApiError && error.kind === 'offline') {
    return { status: 'offline' };
  }
  const message = error instanceof Error ? error.message : String(error);
  return { status: 'error', error: message };
}
