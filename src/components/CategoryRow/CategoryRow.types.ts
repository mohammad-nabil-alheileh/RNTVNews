import { Category } from '../../types/category';
import { Story } from '../../types/story';

export interface CategoryRowProps {
  category: Category;
  index: number;
  active: boolean;
  onPressStory: (story: Story, list: Story[]) => void;
  onFocusRow: (tag: string, index: number) => void;
}
