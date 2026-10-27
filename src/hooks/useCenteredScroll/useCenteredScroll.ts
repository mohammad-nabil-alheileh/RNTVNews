import { useCallback, useRef } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import { scrollViewTo } from '../../platform/smoothScroll/smoothScroll';
import { SectionLayout } from '../../types/layout';

export function useCenteredScroll(horizontal = false) {
  const scrollRef = useRef<ScrollView>(null);
  const viewportSize = useRef(0);
  const sections = useRef(new Map<string, SectionLayout>());

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      viewportSize.current = horizontal ? width : height;
    },
    [horizontal],
  );

  const sectionLayout = useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      sections.current.set(
        key,
        horizontal ? { offset: x, size: width } : { offset: y, size: height },
      );
    },
    [horizontal],
  );

  const centerOn = useCallback(
    (key: string) => {
      const section = sections.current.get(key);
      if (!section || viewportSize.current === 0) {
        return;
      }
      const center = section.offset + section.size / 2;
      const offset = Math.max(0, center - viewportSize.current / 2);
      scrollViewTo(scrollRef.current, offset, horizontal);
    },
    [horizontal],
  );

  return { scrollRef, onLayout, sectionLayout, centerOn };
}
