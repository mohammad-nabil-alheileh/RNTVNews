import { Article, ArticleBlock, LoadState, Story } from '../../types/story';

export interface ArticleBodyProps {
  story: Story | undefined;
  state: LoadState<Article>;
  onRetry: () => void;
  onBack: () => void;
}

export type ArticleBodyItem =
  | { type: 'header'; story: Story }
  | { type: 'block'; block: ArticleBlock };
