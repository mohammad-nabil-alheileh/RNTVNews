export type Story = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  url: string;
};

export type ArticleTextKind =
  | 'heading'
  | 'paragraph'
  | 'listItem'
  | 'quote'
  | 'code';

export interface ArticleTextBlock {
  kind: ArticleTextKind;
  text: string;
}

export interface ArticleImageBlock {
  kind: 'image';
  url: string;
  alt: string;
  aspectRatio: number | null;
}

export type ArticleBlock = ArticleTextBlock | ArticleImageBlock;

export type Article = Story & {
  blocks: ArticleBlock[];
};

export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string; timedOut?: boolean }
  | { status: 'offline' }
  | { status: 'success'; data: T };
