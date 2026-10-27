import { Ref } from 'react';
import { View } from 'react-native';
import { Story } from '../../../types/story';

export interface StoryCardProps {
  story: Story;
  onPress: (story: Story) => void;
  onFocus?: (story: Story) => void;
  hasTVPreferredFocus?: boolean;
  width?: number;
  ref?: Ref<View>;
}
