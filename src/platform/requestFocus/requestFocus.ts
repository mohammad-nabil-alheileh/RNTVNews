import { View } from 'react-native';

export function requestFocus(view: View | null): void {
  (
    view as unknown as { requestTVFocus?: () => void } | null
  )?.requestTVFocus?.();
}
