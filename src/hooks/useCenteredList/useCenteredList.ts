import { useCallback, useRef } from 'react';
import { FlatList, LayoutChangeEvent } from 'react-native';
import { RecordCell } from '../../components/shared/MeasuredCell/MeasuredCell.types';
import { scrollListTo } from '../../platform/smoothScroll/smoothScroll';
import { SectionLayout } from '../../types/layout';

export function useCenteredList<T>() {
  const listRef = useRef<FlatList<T>>(null);
  const viewportHeight = useRef(0);
  const cells = useRef(new Map<number, SectionLayout>());

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
  }, []);

  const recordCell = useCallback<RecordCell>((index, layout) => {
    cells.current.set(index, layout);
  }, []);

  const centerOn = useCallback((index: number) => {
    const cell = cells.current.get(index);
    const viewport = viewportHeight.current;
    if (!cell || viewport === 0) {
      return;
    }
    const offset =
      cell.size > viewport
        ? cell.offset
        : cell.offset + cell.size / 2 - viewport / 2;
    scrollListTo(listRef.current, Math.max(0, offset));
  }, []);

  return { listRef, onLayout, recordCell, centerOn };
}
