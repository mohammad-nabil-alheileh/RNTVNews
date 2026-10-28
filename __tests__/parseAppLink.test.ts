import { parseAppLink } from '../src/utils/parseAppLink/parseAppLink';

describe('parseAppLink', () => {
  it.each([
    ['tvnewsreader://', { screen: 'Home' }],
    ['tvnewsreader://home', { screen: 'Home' }],
    ['tvnewsreader://story/123', { screen: 'Article', storyId: 123 }],
    ['TVNEWSREADER://Article/42/?x=1', { screen: 'Article', storyId: 42 }],
    ['tvnewsreader://category', { screen: 'Category' }],
    ['tvnewsreader://category/React', { screen: 'Category', tag: 'react' }],
    [
      'tvnewsreader://category?tag=python',
      { screen: 'Category', tag: 'python' },
    ],
    ['tvnewsreader://category/unknown', { screen: 'Category' }],
    ['tvnewsreader://search', { screen: 'Search' }],
    [
      'tvnewsreader://search?q=rust+async',
      { screen: 'Search', query: 'rust async' },
    ],
    [
      'tvnewsreader://search/%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1',
      { screen: 'Search', query: 'الذكاء' },
    ],
    ['tvnewsreader://saved', { screen: 'Saved' }],
    ['tvnewsreader://settings', { screen: 'Settings' }],
    ['tvnewsreader://about', { screen: 'About' }],
    ['https://dev.to', { screen: 'Home' }],
    ['https://dev.to/t/javascript', { screen: 'Category', tag: 'javascript' }],
    ['https://dev.to/t/rust', { screen: 'Search', query: 'rust' }],
    [
      'https://www.dev.to/search?q=docker%20tips',
      { screen: 'Search', query: 'docker tips' },
    ],
    [
      'https://dev.to/ben/my-post-1a2b',
      { screen: 'DevtoArticle', path: 'ben/my-post-1a2b' },
    ],
  ])('%s', (url, expected) => {
    expect(parseAppLink(url)).toEqual(expected);
  });

  it.each([
    null,
    '',
    'tvnewsreader://story/abc',
    'tvnewsreader://story/0',
    'tvnewsreader://story',
    'tvnewsreader://unknown',
    'https://example.com/t/react',
    'https://dev.to/ben',
    'https://dev.to/settings/profile',
    'not a link',
  ])('rejects %s', url => {
    expect(parseAppLink(url)).toBeNull();
  });
});
