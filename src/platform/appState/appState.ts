import { AppState } from 'react-native';

export function onAppResume(listener: (awayMs: number) => void): () => void {
  let leftAt: number | null = null;
  const subscription = AppState.addEventListener('change', state => {
    if (state === 'active') {
      if (leftAt !== null) {
        listener(Date.now() - leftAt);
        leftAt = null;
      }
    } else if (leftAt === null) {
      leftAt = Date.now();
    }
  });
  return () => subscription.remove();
}
