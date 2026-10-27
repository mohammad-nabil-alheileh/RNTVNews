import { Article } from '../../types/story';

export interface PendingRemoval {
  article: Article;
  index: number;
}
