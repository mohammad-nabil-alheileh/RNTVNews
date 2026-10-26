import { ArticleBodyItem } from '../../ArticleBody.types';

export interface BodyItemProps {
  item: ArticleBodyItem;
  index: number;
  width: number;
  onFocusItem: (index: number) => void;
  hasTVPreferredFocus?: boolean;
}
