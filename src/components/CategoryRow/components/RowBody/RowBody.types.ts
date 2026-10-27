import { Story } from '../../../../types/story';

export interface RowBodyProps {
  tag: string;
  label: string;
  onPressStory: (story: Story, list: Story[]) => void;
  onFocus?: () => void;
}
