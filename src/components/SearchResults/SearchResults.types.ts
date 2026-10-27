import { Story } from '../../types/story';

export interface SearchResultsProps {
  stories: Story[];
  onOpen: (story: Story, list: Story[]) => void;
}
