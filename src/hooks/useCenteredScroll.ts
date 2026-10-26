import {useCallback, useRef} from 'react';
import {LayoutChangeEvent, ScrollView} from 'react-native';
import {scrollViewTo} from '../platform/smoothScroll/smoothScroll';

interface SectionLayout {
  y: number;
  height: number;
}

export function useCenteredScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const viewportHeight = useRef(0);
  const sections = useRef(new Map<string, SectionLayout>());

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
  }, []);

  const sectionLayout = useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      const {y, height} = event.nativeEvent.layout;
      sections.current.set(key, {y, height});
    },
    [],
  );

  const centerOn = useCallback((key: string) => {
    const section = sections.current.get(key);
    if (!section || viewportHeight.current === 0) {
      return;
    }
    const sectionCenter = section.y + section.height / 2;
    const offset = Math.max(0, sectionCenter - viewportHeight.current / 2);
    scrollViewTo(scrollRef.current, offset);
  }, []);

  return {scrollRef, onLayout, sectionLayout, centerOn};
}
