import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';
import { CATEGORIES } from '../../api/categories';
import { useCenteredScroll } from '../../hooks/useCenteredScroll/useCenteredScroll';
import { useLanguage } from '../../hooks/useLanguage/useLanguage';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { layoutDirectionProps } from '../../platform/layoutDirection/layoutDirection';
import { visualOrder } from '../../utils/visualOrder/visualOrder';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { FocusableButton } from '../shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { makeStyles } from './CategoryTabs.styles';
import { CategoryTabsProps } from './CategoryTabs.types';

const SELECT_DELAY_MS = 400;

export function CategoryTabs({
  selectedTag,
  onSelect,
  onFocusTab,
  selectedRef,
}: CategoryTabsProps) {
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const { isRTL, direction } = useTheme();
  const ltr = layoutDirectionProps('ltr');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { scrollRef, onLayout, sectionLayout, centerOn } =
    useCenteredScroll(true);

  const [selectedTab, setSelectedTab] = useState<View | null>(null);
  const attachSelected = useCallback(
    (node: View | null) => {
      selectedRef.current = node;
      setSelectedTab(node);
    },
    [selectedRef],
  );

  const cancel = () => clearTimeout(timer.current);
  useEffect(() => cancel, []);

  const tabs = visualOrder(CATEGORIES, isRTL);
  const alignSelected = () => {
    const position = tabs.findIndex(category => category.tag === selectedTag);
    if (position === tabs.length - 1) {
      scrollRef.current?.scrollToEnd({ animated: false });
    } else if (position === 0) {
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    } else {
      centerOn(selectedTag);
    }
  };

  const measureTab = (tag: string) => {
    const record = sectionLayout(tag);
    return (event: LayoutChangeEvent) => {
      record(event);
      if (tag === selectedTag) {
        centerOn(tag);
      }
    };
  };

  return (
    <FocusGroup remember trap={['left', 'right']} entry={selectedTab}>
      <ScrollView
        key={direction}
        {...ltr}
        style={ltr.style}
        ref={scrollRef}
        onLayout={onLayout}
        onContentSizeChange={alignSelected}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {tabs.map(category => {
          const selected = category.tag === selectedTag;
          return (
            <View key={category.tag} onLayout={measureTab(category.tag)}>
              <FocusableButton
                ref={selected ? attachSelected : undefined}
                label={category.label[language]}
                selected={selected}
                hasTVPreferredFocus={selected}
                onFocus={() => {
                  centerOn(category.tag);
                  onFocusTab();
                  cancel();
                  timer.current = setTimeout(
                    () => onSelect(category.tag),
                    SELECT_DELAY_MS,
                  );
                }}
                onBlur={cancel}
                onPress={() => {
                  cancel();
                  onSelect(category.tag);
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </FocusGroup>
  );
}
