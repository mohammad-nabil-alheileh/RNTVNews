import { CATEGORIES } from '../../api/categories';
import { ParsedLink } from '../../types/appLink';

const LINK = /^([a-z][a-z0-9+.-]*):\/\/([^/?#]*)([^?#]*)(?:\?([^#]*))?/i;
const DEVTO_HOSTS = ['dev.to', 'www.dev.to'];
const DEVTO_PAGES = new Set([
  'about',
  'api',
  'code-of-conduct',
  'contact',
  'dashboard',
  'enter',
  'faq',
  'latest',
  'privacy',
  'readinglist',
  'settings',
  'tags',
  'terms',
  'top',
]);

function decode(text: string): string {
  try {
    return decodeURIComponent(text.replace(/\+/g, ' '));
  } catch {
    return text;
  }
}

function queryParam(query: string, name: string): string | undefined {
  for (const pair of query.split('&')) {
    const [key, value = ''] = pair.split('=');
    if (decode(key) === name) {
      return decode(value);
    }
  }
  return undefined;
}

function knownTag(tag: string | undefined): string | undefined {
  const wanted = tag?.toLowerCase();
  return CATEGORIES.find(category => category.tag === wanted)?.tag;
}

function storyId(text: string | undefined): number | null {
  if (!text || !/^\d+$/.test(text)) {
    return null;
  }
  const id = Number(text);
  return id > 0 && Number.isSafeInteger(id) ? id : null;
}

function searchLink(query: string | undefined): ParsedLink {
  const trimmed = query?.trim();
  return trimmed ? { screen: 'Search', query: trimmed } : { screen: 'Search' };
}

function appLink(
  page: string,
  parts: string[],
  query: string,
): ParsedLink | null {
  switch (page) {
    case '':
    case 'home':
      return { screen: 'Home' };
    case 'story':
    case 'article': {
      const id = storyId(parts[0]);
      return id === null ? null : { screen: 'Article', storyId: id };
    }
    case 'category':
    case 'categories': {
      const tag = knownTag(parts[0] ?? queryParam(query, 'tag'));
      return tag ? { screen: 'Category', tag } : { screen: 'Category' };
    }
    case 'search':
      return searchLink(parts[0] ?? queryParam(query, 'q'));
    case 'saved':
      return { screen: 'Saved' };
    case 'settings':
      return { screen: 'Settings' };
    case 'about':
      return { screen: 'About' };
    default:
      return null;
  }
}

function devtoLink(parts: string[], query: string): ParsedLink | null {
  const [first, second] = parts;
  if (!first) {
    return { screen: 'Home' };
  }
  if (first === 't' && second) {
    const tag = knownTag(second);
    return tag ? { screen: 'Category', tag } : searchLink(second);
  }
  if (first === 'search') {
    return searchLink(queryParam(query, 'q'));
  }
  if (parts.length === 2 && !DEVTO_PAGES.has(first)) {
    return {
      screen: 'DevtoArticle',
      path: `${encodeURIComponent(first)}/${encodeURIComponent(second)}`,
    };
  }
  return null;
}

export function parseAppLink(
  url: string | null | undefined,
): ParsedLink | null {
  const match = url?.trim().match(LINK);
  if (!match) {
    return null;
  }
  const scheme = match[1].toLowerCase();
  const host = match[2].toLowerCase();
  const parts = match[3].split('/').filter(Boolean).map(decode);
  const query = match[4] ?? '';

  if (scheme === 'tvnewsreader') {
    return appLink(host, parts, query);
  }
  if ((scheme === 'https' || scheme === 'http') && DEVTO_HOSTS.includes(host)) {
    return devtoLink(parts, query);
  }
  return null;
}

export function storyLink(id: number): string {
  return `tvnewsreader://story/${id}`;
}
