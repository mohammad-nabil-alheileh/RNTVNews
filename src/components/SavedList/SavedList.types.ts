import { SavedArticle } from '../../types/saved';
import { Article } from '../../types/story';

export interface SavedListProps {
  items: SavedArticle[];
  preferredIndex: number;
  onOpen: (article: Article) => void;
  onRemove: (article: Article, index: number) => void;
}
