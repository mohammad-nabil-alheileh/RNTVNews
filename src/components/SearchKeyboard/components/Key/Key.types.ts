export interface KeyProps {
  label: string;
  value: string;
  onPress: (value: string) => void;
  wide?: boolean;
  hasTVPreferredFocus?: boolean;
}
