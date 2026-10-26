import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { fetchStoriesByTag } from '../../api/devto';
import { useCenteredRail } from '../../hooks/useCenteredRail/useCenteredRail';
import { useLoad } from '../../hooks/useLoad/useLoad';
import { useLanguage } from '../../i18n/language';
import { useStyles, useTheme } from '../../theme/theme';
import { Story } from '../../types/story';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { StatusView } from '../shared/StatusView/StatusView';
import { StoryCard } from '../shared/StoryCard/StoryCard';
import { STORY_CARD_WIDTH } from '../shared/StoryCard/StoryCard.styles';
import { makeStyles } from './CategoryRow.styles';
import { CategoryRowProps } from './CategoryRow.types';

const keyOf = (story: Story) => String(story.id);

export function CategoryRow({
  category,
  onPressStory,
  onFocus,
}: CategoryRowProps) {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const language = useLanguage();
  const label = category.label[language];

  const { listRef, onLayout, centerOn } = useCenteredRail<Story>({
    itemWidth: theme.scale(STORY_CARD_WIDTH),
    gap: theme.spacing.lg,
    paddingStart: theme.safeArea.horizontal,
  });

  const load = useCallback(
    () => fetchStoriesByTag(category.tag),
    [category.tag],
  );
  const { state, reload } = useLoad(load);

  const renderBody = () => {
    switch (state.status) {
      case 'loading':
        return (
          <StatusView
            kind="loading"
            title={`Loading ${label}…`}
            actionLabel="Reload"
            onAction={reload}
          />
        );
      case 'offline':
        return (
          <StatusView
            kind="offline"
            title="No connection"
            actionLabel="Retry"
            onAction={reload}
          />
        );
      case 'error':
        return (
          <StatusView
            kind="error"
            title={`Couldn't load ${label}`}
            actionLabel="Retry"
            onAction={reload}
          />
        );
      case 'success':
        if (state.data.length === 0) {
          return (
            <StatusView
              kind="empty"
              title={`No ${label} stories yet`}
              actionLabel="Retry"
              onAction={reload}
            />
          );
        }
        return (
          <FlatList
            ref={listRef}
            onLayout={onLayout}
            horizontal
            data={state.data}
            keyExtractor={keyOf}
            renderItem={({ item, index }) => (
              <StoryCard
                story={item}
                onPress={story => onPressStory(story, state.data)}
                onFocus={() => {
                  centerOn(index);
                  onFocus?.();
                }}
              />
            )}
            contentContainerStyle={styles.list}
            showsHorizontalScrollIndicator={false}
          />
        );
    }
  };

  return (
    <View>
      <Text style={styles.title} accessibilityRole="header">
        {label}
      </Text>
      <FocusGroup remember trap={['left', 'right']} style={styles.body}>
        {renderBody()}
      </FocusGroup>
    </View>
  );
}
