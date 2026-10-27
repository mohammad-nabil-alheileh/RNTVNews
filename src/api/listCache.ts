import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story } from '../types/story';
import { addStories } from './storyStore';

const STORAGE_PREFIX = 'list:';
const PREFETCH_CONCURRENCY = 2;

const lists = new Map<string, Story[]>();
const freshKeys = new Set<string>();
const inFlight = new Map<string, Promise<Story[]>>();
const listeners = new Map<string, Set<() => void>>();
const readyListeners = new Set<() => void>();
let ready = false;

function emit(key: string) {
  listeners.get(key)?.forEach(listener => listener());
}

function persist(key: string, stories: Story[]) {
  AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(stories)).catch(
    error => {
      if (__DEV__) {
        console.warn(`Caching ${key} failed`, error);
      }
    },
  );
}

export async function loadListCache(keys: string[]): Promise<void> {
  try {
    const entries = await AsyncStorage.multiGet(
      keys.map(key => STORAGE_PREFIX + key),
    );
    for (const [storageKey, raw] of entries) {
      if (raw) {
        const stories = JSON.parse(raw) as Story[];
        lists.set(storageKey.slice(STORAGE_PREFIX.length), stories);
        addStories(stories);
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('Loading cached stories failed', error);
    }
  }
  ready = true;
  readyListeners.forEach(listener => listener());
}

export function isListCacheReady(): boolean {
  return ready;
}

export function subscribeListCacheReady(listener: () => void): () => void {
  readyListeners.add(listener);
  return () => {
    readyListeners.delete(listener);
  };
}

export function getCachedList(key: string): Story[] | undefined {
  return lists.get(key);
}

export function isListFresh(key: string): boolean {
  return freshKeys.has(key);
}

export function subscribeList(key: string, listener: () => void): () => void {
  const set = listeners.get(key) ?? new Set();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
  };
}

export function fetchList(
  key: string,
  fetcher: () => Promise<Story[]>,
): Promise<Story[]> {
  const running = inFlight.get(key);
  if (running) {
    return running;
  }
  const request = fetcher()
    .then(stories => {
      lists.set(key, stories);
      freshKeys.add(key);
      persist(key, stories);
      emit(key);
      return stories;
    })
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, request);
  return request;
}

export function prefetchLists(
  jobs: { key: string; fetcher: () => Promise<Story[]> }[],
): () => void {
  let cancelled = false;
  const queue = [...jobs];

  const worker = async () => {
    while (!cancelled) {
      const job = queue.shift();
      if (!job) {
        return;
      }
      if (!freshKeys.has(job.key)) {
        await fetchList(job.key, job.fetcher).catch(() => undefined);
      }
    }
  };

  for (let i = 0; i < PREFETCH_CONCURRENCY; i++) {
    worker();
  }
  return () => {
    cancelled = true;
  };
}
