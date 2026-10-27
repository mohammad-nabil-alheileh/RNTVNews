import { Story } from '../types/story';
import { fetchLatestStories, fetchStoriesByTag } from './devto';
import { getAllStories } from './storyStore';
import { normalizeText } from '../utils/normalizeText/normalizeText';

const MAX_RESULTS = 40;
const TITLE_WEIGHT = 3;
const TAG_WEIGHT = 2;
const DESCRIPTION_WEIGHT = 1;
const TAG_WORD = /^[a-z0-9]{2,30}$/;
const MAX_TAG_WORDS = 3;
const REFRESH_TTL_MS = 2 * 60 * 1000;

const refreshedAt = new Map<string, number>();

const ARABIC_ARTICLE = '\u0627\u0644';

function wordsOf(text: string): string[] {
  return normalizeText(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function hasWordStartingWith(words: string[], term: string): boolean {
  return words.some(
    word =>
      word.startsWith(term) ||
      (word.startsWith(ARABIC_ARTICLE) &&
        word.startsWith(term, ARABIC_ARTICLE.length)),
  );
}

function termScore(
  term: string,
  title: string[],
  tags: string[],
  description: string[],
) {
  if (hasWordStartingWith(title, term)) {
    return TITLE_WEIGHT;
  }
  if (hasWordStartingWith(tags, term)) {
    return TAG_WEIGHT;
  }
  if (hasWordStartingWith(description, term)) {
    return DESCRIPTION_WEIGHT;
  }
  return 0;
}

export function searchStories(query: string): Story[] {
  const terms = wordsOf(query);
  if (terms.length === 0) {
    return [];
  }

  const scored: { story: Story; score: number }[] = [];
  for (const story of getAllStories()) {
    const title = wordsOf(story.title);
    const tags = wordsOf(story.tags.join(' '));
    const description = wordsOf(story.description);
    let score = 0;
    for (const term of terms) {
      const points = termScore(term, title, tags, description);
      if (points === 0) {
        score = 0;
        break;
      }
      score += points;
    }
    if (score > 0) {
      scored.push({ story, score });
    }
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.story.publishedAt.localeCompare(a.story.publishedAt),
    )
    .slice(0, MAX_RESULTS)
    .map(item => item.story);
}

function tagWords(query: string): string[] {
  const words = normalizeText(query)
    .split(/\s+/)
    .filter(word => TAG_WORD.test(word));
  return Array.from(new Set(words)).slice(0, MAX_TAG_WORDS);
}

export async function refreshForQuery(query: string): Promise<boolean> {
  const jobs: [string, () => Promise<unknown>][] = [
    ['latest', fetchLatestStories],
    ...tagWords(query).map((tag): [string, () => Promise<unknown>] => [
      `tag:${tag}`,
      () => fetchStoriesByTag(tag),
    ]),
  ];
  const now = Date.now();
  const due = jobs.filter(
    ([key]) => now - (refreshedAt.get(key) ?? 0) > REFRESH_TTL_MS,
  );
  if (due.length === 0) {
    return true;
  }
  const outcomes = await Promise.allSettled(
    due.map(([key, run]) =>
      run().then(() => {
        refreshedAt.set(key, Date.now());
      }),
    ),
  );
  return outcomes.some(outcome => outcome.status === 'fulfilled');
}
