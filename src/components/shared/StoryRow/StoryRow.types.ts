import { StyleProp, ViewStyle } from 'react-native';
import { Story } from '../../../types/story';

export interface StoryRowProps {
  story: Story;
  onPress: (story: Story) => void;
  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}
