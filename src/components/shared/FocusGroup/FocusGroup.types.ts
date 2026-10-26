import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FocusDirection } from '../../../types/focus';

export interface FocusGroupProps {
  children: ReactNode;
  remember?: boolean;
  trap?: FocusDirection[];
  style?: StyleProp<ViewStyle>;
}
