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

export type Article = Story & {
  bodyHtml: string;
};

export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'offline' }
  | { status: 'success'; data: T };
