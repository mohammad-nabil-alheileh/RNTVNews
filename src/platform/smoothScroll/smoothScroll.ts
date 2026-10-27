import { FlatList, ScrollView } from 'react-native';

export function scrollListTo<T>(list: FlatList<T> | null, offset: number) {
  list?.scrollToOffset({ offset, animated: true });
}

export function scrollViewTo(
  view: ScrollView | null,
  offset: number,
  horizontal = false,
) {
  view?.scrollTo(
    horizontal ? { x: offset, animated: true } : { y: offset, animated: true },
  );
}
