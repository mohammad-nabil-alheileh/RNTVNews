import { View } from 'react-native';

export function requestFocus(view: View | null): void {
  (view as unknown as HTMLElement | null)?.focus({ preventScroll: true });
}
