import { ApiErrorKind } from '../types/api';
import { DevtoArticle } from '../types/devto';
import { Article, Story } from '../types/story';
import { addStories } from './storyStore';
import { parseArticleBody } from './articleBody';

const BASE_URL = 'https://dev.to/api';
const PAGE_SIZE = 30;
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

async function getJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(BASE_URL + path, { signal: controller.signal });
  } catch (cause) {
    if (__DEV__) {
      console.warn(`dev.to request failed: ${path}`, cause);
    }
    throw new ApiError('offline', 'Network request failed');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError('error', `dev.to responded ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function tagsOf(raw: DevtoArticle): string[] {
  const list = Array.isArray(raw.tag_list) ? raw.tag_list : raw.tags;
  if (Array.isArray(list)) {
    return list;
  }
  return list
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function toStory(raw: DevtoArticle): Story {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    imageUrl: raw.cover_image ?? raw.social_image ?? null,
    author: raw.user.name,
    publishedAt: raw.published_at,
    readingMinutes: raw.reading_time_minutes,
    tags: tagsOf(raw),
    url: raw.url,
  };
}

async function fetchStoryList(path: string): Promise<Story[]> {
  const raw = await getJson<DevtoArticle[]>(path);
  const stories = raw.map(toStory);
  addStories(stories);
  return stories;
}

export function fetchTopStories(): Promise<Story[]> {
  return fetchStoryList(`/articles?top=7&per_page=${PAGE_SIZE}`);
}

export function fetchStoriesByTag(tag: string): Promise<Story[]> {
  return fetchStoryList(
    `/articles?tag=${encodeURIComponent(tag)}&per_page=${PAGE_SIZE}`,
  );
}

export async function fetchArticle(id: number): Promise<Article> {
  const raw = await getJson<DevtoArticle>(`/articles/${id}`);
  const story = toStory(raw);
  addStories([story]);
  return { ...story, blocks: parseArticleBody(raw.body_html ?? '') };
}
