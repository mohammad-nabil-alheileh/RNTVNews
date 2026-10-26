import {StyleProp, ViewStyle} from 'react-native';

export interface FocusableButtonProps {
  label: string;
  onPress: () => void;
  hasTVPreferredFocus?: boolean;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
