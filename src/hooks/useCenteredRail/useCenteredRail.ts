import { useCallback, useRef, useState } from 'react';
import { FlatList, LayoutChangeEvent } from 'react-native';
import { scrollListTo } from '../../platform/smoothScroll/smoothScroll';
import { RailLayout } from './useCenteredRail.types';

export function useCenteredRail<T>({
  itemWidth,
  gap,
  paddingStart,
  initialIndex,
}: RailLayout) {
  const listRef = useRef<FlatList<T>>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const restored = useRef(initialIndex === undefined);

  const offsetFor = useCallback(
    (index: number, width: number) => {
      const itemCenter =
        paddingStart + index * (itemWidth + gap) + itemWidth / 2;
      return Math.max(0, itemCenter - width / 2);
    },
    [gap, itemWidth, paddingStart],
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setViewportWidth(width);
      if (!restored.current && initialIndex !== undefined) {
        restored.current = true;
        listRef.current?.scrollToOffset({
          offset: offsetFor(initialIndex, width),
          animated: false,
        });
      }
    },
    [initialIndex, offsetFor],
  );

  const centerOn = useCallback(
    (index: number) => {
      if (viewportWidth === 0) {
        return;
      }
      scrollListTo(listRef.current, offsetFor(index, viewportWidth));
    },
    [offsetFor, viewportWidth],
  );

  return { listRef, onLayout, centerOn };
}
