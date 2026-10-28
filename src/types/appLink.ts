export type AppLink =
  | { screen: 'Home' }
  | { screen: 'Category'; tag?: string }
  | { screen: 'Article'; storyId: number }
  | { screen: 'Search'; query?: string }
  | { screen: 'Saved' }
  | { screen: 'Settings' }
  | { screen: 'About' };

export type ParsedLink = AppLink | { screen: 'DevtoArticle'; path: string };
