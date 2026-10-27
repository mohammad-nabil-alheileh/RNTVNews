import { Article } from './story';

export interface SavedArticle {
  article: Article;
  savedAt: number;
}

export interface SavedState {
  loaded: boolean;
  items: SavedArticle[];
}
