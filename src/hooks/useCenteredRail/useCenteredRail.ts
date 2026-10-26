import { useCallback, useRef, useState } from 'react';
import { FlatList, LayoutChangeEvent } from 'react-native';
import { scrollListTo } from '../../platform/smoothScroll/smoothScroll';
import { RailLayout } from './useCenteredRail.types';

export function useCenteredRail<T>({
  itemWidth,
  gap,
  paddingStart,
}: RailLayout) {
  const listRef = useRef<FlatList<T>>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
  }, []);

  const centerOn = useCallback(
    (index: number) => {
      if (viewportWidth === 0) {
        return;
      }
      const itemCenter =
        paddingStart + index * (itemWidth + gap) + itemWidth / 2;
      const offset = Math.max(0, itemCenter - viewportWidth / 2);
      scrollListTo(listRef.current, offset);
    },
    [gap, itemWidth, paddingStart, viewportWidth],
  );

  return { listRef, onLayout, centerOn };
}
