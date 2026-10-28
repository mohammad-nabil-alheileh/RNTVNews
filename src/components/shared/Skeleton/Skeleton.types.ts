import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
