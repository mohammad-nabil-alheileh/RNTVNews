import { Category } from '../../types/category';
import { Story } from '../../types/story';

export interface CategoryRowProps {
  category: Category;
  onPressStory: (story: Story) => void;
  onFocus?: () => void;
}
