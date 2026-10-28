import { Category } from '../../types/category';
import { Story } from '../../types/story';

export interface CategoryRowProps {
  category: Category;
  index: number;
  onPressStory: (story: Story, list: Story[]) => void;
  onFocusRow: (tag: string, index: number) => void;
}
