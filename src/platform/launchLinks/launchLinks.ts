import { Linking } from 'react-native';

export function getInitialLink(): Promise<string | null> {
  return Linking.getInitialURL().catch(() => null);
}

export function onLink(listener: (url: string) => void): () => void {
  const subscription = Linking.addEventListener('url', event =>
    listener(event.url),
  );
  return () => subscription.remove();
}
