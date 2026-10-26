import { useCallback, useRef, useState } from 'react';
import { FlatList, LayoutChangeEvent } from 'react-native';
import { scrollListTo } from '../../platform/smoothScroll/smoothScroll';
import { SectionLayout } from '../../types/layout';
import { createMeasuredCell } from './measuredCell';

export function useCenteredList<T>() {
  const listRef = useRef<FlatList<T>>(null);
  const viewportHeight = useRef(0);
  const cells = useRef(new Map<number, SectionLayout>());
  const [Cell] = useState(() => createMeasuredCell<T>(cells.current));

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
  }, []);

  const centerOn = useCallback((index: number) => {
    const cell = cells.current.get(index);
    const viewport = viewportHeight.current;
    if (!cell || viewport === 0) {
      return;
    }
    const offset =
      cell.height > viewport ? cell.y : cell.y + cell.height / 2 - viewport / 2;
    scrollListTo(listRef.current, Math.max(0, offset));
  }, []);

  return { listRef, onLayout, Cell, centerOn };
}
