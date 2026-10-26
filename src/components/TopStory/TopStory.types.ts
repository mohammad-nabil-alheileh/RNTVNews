import {Story} from '../../types/story';

export interface TopStoryProps {
  story: Story;
  onPress: (story: Story) => void;
  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
}
