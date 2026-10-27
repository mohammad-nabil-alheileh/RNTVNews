import { RefObject } from 'react';
import { View } from 'react-native';

export interface CategoryTabsProps {
  selectedTag: string;
  onSelect: (tag: string) => void;
  onFocusTab: () => void;
  selectedRef: RefObject<View | null>;
}
