import { BackHandler } from 'react-native';

export function onBack(handler: () => boolean): () => void {
  const subscription = BackHandler.addEventListener(
    'hardwareBackPress',
    handler,
  );
  return () => subscription.remove();
}

export function exitApp(): void {
  BackHandler.exitApp();
}
