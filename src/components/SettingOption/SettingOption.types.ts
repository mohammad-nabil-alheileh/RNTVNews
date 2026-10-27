export interface SettingOptionItem {
  value: string;
  label: string;
}

export interface SettingOptionProps {
  title: string;
  options: SettingOptionItem[];
  selected: string;
  onSelect: (value: string) => void;
  hasTVPreferredFocus?: boolean;
}
