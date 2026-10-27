import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FocusDirection } from '../../../types/focus';

export interface FocusGroupProps {
  children: ReactNode;
  remember?: boolean;
  trap?: FocusDirection[];
  entry?: View | null;
  style?: StyleProp<ViewStyle>;
}
