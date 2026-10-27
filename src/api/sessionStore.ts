import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, SessionState } from '../types/auth';

const STORAGE_KEY = 'session';

let state: SessionState = { loaded: false, session: null };
const listeners = new Set<() => void>();

function update(session: Session | null) {
  state = { loaded: true, session };
  listeners.forEach(listener => listener());
}

function persist(session: Session | null) {
  const write = session
    ? AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    : AsyncStorage.removeItem(STORAGE_KEY);
  write.catch(error => {
    if (__DEV__) {
      console.warn('Saving the sign-in failed', error);
    }
  });
}

export async function loadSession(): Promise<void> {
  let session: Session | null = null;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    session = raw ? (JSON.parse(raw) as Session) : null;
  } catch (error) {
    if (__DEV__) {
      console.warn('Loading the sign-in failed', error);
    }
  }
  update(session);
}

export function getSession(): SessionState {
  return state;
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setSession(session: Session): void {
  update(session);
  persist(session);
}

export function clearSession(): void {
  update(null);
  persist(null);
}
