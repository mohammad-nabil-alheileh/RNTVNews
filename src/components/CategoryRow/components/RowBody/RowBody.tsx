import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { fetchStoriesByTag } from '../../../../api/devto';
import { getRowMemory, setRowMemory } from '../../../../api/rowMemory';
import { useCenteredRail } from '../../../../hooks/useCenteredRail/useCenteredRail';
import { useCachedList } from '../../../../hooks/useCachedList/useCachedList';
import { useStyles } from '../../../../hooks/useStyles/useStyles';
import { useTheme } from '../../../../hooks/useTheme/useTheme';
import { Story } from '../../../../types/story';
import { layoutDirectionProps } from '../../../../platform/layoutDirection/layoutDirection';
import { visualOrder } from '../../../../utils/visualOrder/visualOrder';
import { FocusGroup } from '../../../shared/FocusGroup/FocusGroup';
import { StatusView } from '../../../shared/StatusView/StatusView';
import { StoryCard } from '../../../shared/StoryCard/StoryCard';
import { STORY_CARD_WIDTH } from '../../../shared/StoryCard/StoryCard.styles';
import { RowGap } from './components/RowGap/RowGap';
import { makeStyles } from './RowBody.styles';
import { RowBodyProps } from './RowBody.types';
import { useTranslation } from '../../../../hooks/useTranslation/useTranslation';

const keyOf = (story: Story) => String(story.id);
const NO_STORIES: Story[] = [];

export function RowBody({ tag, label, onPressStory, onFocus }: RowBodyProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const itemWidth = theme.scale(STORY_CARD_WIDTH);
  const gap = theme.spacing.lg;
  const paddingStart = theme.safeArea.horizontal;

  const load = useCallback(() => fetchStoriesByTag(tag), [tag]);
  const { state, reload } = useCachedList(tag, load);
  const [remembered] = useState(() => getRowMemory(tag));
  const [shown, setShown] = useState<Story[] | null>(
    remembered?.stories ?? null,
  );
  const ltr = layoutDirectionProps('ltr');
  const [entryCard, setEntryCard] = useState<View | null>(null);

  const getItemLayout = useCallback(
    (_: ArrayLike<Story> | null | undefined, index: number) => ({
      length: itemWidth + gap,
      offset: paddingStart + index * (itemWidth + gap),
      index,
    }),
    [itemWidth, gap, paddingStart],
  );

  const loaded = state.status === 'success' ? state.data : NO_STORIES;
  const stories = shown ?? loaded;
  const cards = useMemo(
    () => visualOrder(stories, theme.isRTL),
    [stories, theme.isRTL],
  );
  const entryId = remembered?.focusedId ?? stories[0]?.id;
  const restoreIndex = remembered
    ? cards.findIndex(card => card.id === remembered.focusedId)
    : -1;

  const { listRef, onLayout, centerOn } = useCenteredRail<Story>({
    itemWidth,
    gap,
    paddingStart,
    initialIndex: restoreIndex >= 0 ? restoreIndex : undefined,
  });

  const openStory = useCallback(
    (story: Story) => onPressStory(story, stories),
    [onPressStory, stories],
  );

  const focusStory = useCallback(
    (story: Story) => {
      if (shown === null) {
        setShown(stories);
      }
      setRowMemory(tag, { stories, focusedId: story.id });
      centerOn(cards.findIndex(card => card.id === story.id));
      onFocus?.();
    },
    [shown, stories, tag, cards, centerOn, onFocus],
  );

  const renderItem = useCallback<ListRenderItem<Story>>(
    ({ item }) => (
      <StoryCard
        ref={item.id === entryId ? setEntryCard : undefined}
        story={item}
        onPress={openStory}
        onFocus={focusStory}
      />
    ),
    [entryId, openStory, focusStory],
  );

  let initialScrollIndex: number | undefined;
  if (restoreIndex >= 0) {
    initialScrollIndex = Math.max(0, restoreIndex - 2);
  } else if (theme.isRTL) {
    initialScrollIndex = cards.length - 1;
  }

  switch (state.status) {
    case 'loading':
      return (
        <StatusView
          kind="loading"
          title={t('loadingCategory', { name: label })}
          actionLabel={t('reload')}
          onAction={reload}
        />
      );
    case 'offline':
      return (
        <StatusView
          kind="offline"
          title={t('noConnection')}
          actionLabel={t('retry')}
          onAction={reload}
        />
      );
    case 'error':
      return (
        <StatusView
          kind="error"
          title={t('couldntLoadCategory', { name: label })}
          actionLabel={t('retry')}
          onAction={reload}
        />
      );
    case 'success':
      if (state.data.length === 0) {
        return (
          <StatusView
            kind="empty"
            title={t('noCategoryStories', { name: label })}
            actionLabel={t('retry')}
            onAction={reload}
          />
        );
      }
      return (
        <FocusGroup remember trap={['left', 'right']} entry={entryCard}>
          <FlatList
            key={theme.direction}
            {...ltr}
            style={ltr.style}
            initialScrollIndex={initialScrollIndex}
            ref={listRef}
            onLayout={onLayout}
            horizontal
            data={cards}
            keyExtractor={keyOf}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={RowGap}
            initialNumToRender={6}
            maxToRenderPerBatch={3}
            windowSize={3}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsHorizontalScrollIndicator={false}
          />
        </FocusGroup>
      );
  }
}
