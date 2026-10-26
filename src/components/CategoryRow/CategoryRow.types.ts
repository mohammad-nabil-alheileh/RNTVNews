import { Category } from '../../types/category';
import { Story } from '../../types/story';

export interface CategoryRowProps {
  category: Category;
  onPressStory: (story: Story, list: Story[]) => void;
  onFocus?: () => void;
}
