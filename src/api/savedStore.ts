import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedArticle, SavedState } from '../types/saved';
import { Article } from '../types/story';
import { addStories } from './storyStore';

const STORAGE_KEY = 'savedArticles';

let state: SavedState = { loaded: false, items: [] };
const listeners = new Set<() => void>();

function update(items: SavedArticle[]) {
  state = { loaded: true, items };
  listeners.forEach(listener => listener());
}

function persist() {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(
    error => {
      if (__DEV__) {
        console.warn('Saving stories failed', error);
      }
    },
  );
}

export async function loadSaved(): Promise<void> {
  let items: SavedArticle[] = [];
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    items = raw ? (JSON.parse(raw) as SavedArticle[]) : [];
  } catch (error) {
    if (__DEV__) {
      console.warn('Loading saved stories failed', error);
    }
  }
  addStories(items.map(item => item.article));
  update(items);
}

export function subscribeSaved(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSavedState(): SavedState {
  return state;
}

export function getSavedArticle(id: number): Article | undefined {
  return state.items.find(item => item.article.id === id)?.article;
}

export function saveArticle(article: Article): void {
  if (getSavedArticle(article.id)) {
    return;
  }
  update([{ article, savedAt: Date.now() }, ...state.items]);
  persist();
}

export function removeSaved(id: number): void {
  update(state.items.filter(item => item.article.id !== id));
  persist();
}
