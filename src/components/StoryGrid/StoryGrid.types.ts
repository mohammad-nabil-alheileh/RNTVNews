import { Story } from '../../types/story';

export interface StoryGridProps {
  stories: Story[];
  onOpen: (story: Story, list: Story[]) => void;
  onFocusStory: () => void;
}
