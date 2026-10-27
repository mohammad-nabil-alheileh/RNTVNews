import { Article } from '../../../../types/story';

export interface SavedItemProps {
  article: Article;
  index: number;
  onOpen: (article: Article) => void;
  onRemove: (article: Article, index: number) => void;
  onFocusRow: (index: number) => void;
  hasTVPreferredFocus?: boolean;
}
