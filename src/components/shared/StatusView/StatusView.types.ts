import { StyleProp, ViewStyle } from 'react-native';

export type StatusKind = 'loading' | 'empty' | 'error' | 'offline';

export interface StatusViewProps {
  kind: StatusKind;
  title: string;
  message?: string;
  actionLabel: string;
  onAction: () => void;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}
