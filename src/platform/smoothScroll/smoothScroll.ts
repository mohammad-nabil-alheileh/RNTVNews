import { FlatList, ScrollView } from 'react-native';

export function scrollListTo<T>(list: FlatList<T> | null, offset: number) {
  list?.scrollToOffset({ offset, animated: true });
}

export function scrollViewTo(view: ScrollView | null, y: number) {
  view?.scrollTo({ y, animated: true });
}
