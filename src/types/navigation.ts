import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Category: { tag?: string };
  Article: { storyId: number; queue?: number[] };
  Search: { query?: string } | undefined;
  Saved: undefined;
  Settings: undefined;
  About: undefined;
  SignIn: { linkWaiting?: 'story' | 'page' } | undefined;
};

export type ScreenProps<Name extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Name>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
