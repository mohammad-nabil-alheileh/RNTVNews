import { Ref } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export interface FocusableButtonProps {
  label: string;
  onPress: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  ref?: Ref<View>;
  hasTVPreferredFocus?: boolean;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
