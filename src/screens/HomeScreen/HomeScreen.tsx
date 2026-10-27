import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CATEGORIES } from '../../api/categories';
import { fetchStoriesByTag, fetchTopStories } from '../../api/devto';
import { prefetchLists } from '../../api/listCache';
import { clearRowMemory } from '../../api/rowMemory';
import { CategoryRow } from '../../components/CategoryRow/CategoryRow';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary/ErrorBoundary';
import { FocusGroup } from '../../components/shared/FocusGroup/FocusGroup';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { TopStory } from '../../components/TopStory/TopStory';
import { useCenteredScroll } from '../../hooks/useCenteredScroll/useCenteredScroll';
import { useCachedList } from '../../hooks/useCachedList/useCachedList';
import { useListCacheReady } from '../../hooks/useListCacheReady/useListCacheReady';
import { useLanguage } from '../../hooks/useLanguage/useLanguage';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { ScreenProps } from '../../types/navigation';
import { RowFocus } from '../../types/layout';
import { Story } from '../../types/story';
import { isRowInWindow } from '../../utils/isRowInWindow/isRowInWindow';
import { makeStyles } from './HomeScreen.styles';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

const TOP_SECTION = 'top';
const TOP_ROW = -1;

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const ready = useListCacheReady();
  const { state, reload } = useCachedList('top', fetchTopStories);
  const { scrollRef, onLayout, sectionLayout, centerOn } = useCenteredScroll();
  const [rowFocus, setRowFocus] = useState<RowFocus>({
    row: TOP_ROW,
    movingDown: true,
  });

  const moveRowFocus = useCallback((row: number) => {
    setRowFocus(prev =>
      prev.row === row ? prev : { row, movingDown: row > prev.row },
    );
  }, []);

  const focusRow = useCallback(
    (tag: string, index: number) => {
      centerOn(tag);
      moveRowFocus(index);
    },
    [centerOn, moveRowFocus],
  );

  const focusTop = useCallback(() => {
    centerOn(TOP_SECTION);
    moveRowFocus(TOP_ROW);
  }, [centerOn, moveRowFocus]);

  useEffect(() => clearRowMemory, []);

  const openStory = useCallback(
    (story: Story, list: Story[]) =>
      navigation.navigate('Article', {
        storyId: story.id,
        queue: list.map(item => item.id),
      }),
    [navigation],
  );

  useEffect(() => {
    if (!ready) {
      return;
    }
    return prefetchLists(
      CATEGORIES.map(category => ({
        key: category.tag,
        fetcher: () => fetchStoriesByTag(category.tag),
      })),
    );
  }, [ready]);

  const renderContent = () => {
    if (!ready) {
      return null;
    }
    if (state.status === 'loading') {
      return (
        <StatusView
          kind="loading"
          title={t('loadingStories')}
          actionLabel={t('reload')}
          onAction={reload}
          hasTVPreferredFocus
        />
      );
    }

    if (state.status === 'offline') {
      return (
        <StatusView
          kind="offline"
          title={t('noConnection')}
          message={t('checkNetwork')}
          actionLabel={t('retry')}
          onAction={reload}
          hasTVPreferredFocus
        />
      );
    }

    if (state.status === 'error') {
      return (
        <StatusView
          kind="error"
          title={t('couldntLoadStories')}
          message={state.timedOut ? t('timedOut') : state.error}
          actionLabel={t('retry')}
          onAction={reload}
          hasTVPreferredFocus
        />
      );
    }

    const [top] = state.data;

    if (!top) {
      return (
        <StatusView
          kind="empty"
          title={t('noStoriesNow')}
          actionLabel={t('retry')}
          onAction={reload}
          hasTVPreferredFocus
        />
      );
    }

    return (
      <ScrollView
        ref={scrollRef}
        onLayout={onLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View onLayout={sectionLayout(TOP_SECTION)}>
          <FocusGroup trap={['left', 'right']} style={styles.topStory}>
            <TopStory
              story={top}
              onPress={story => openStory(story, state.data)}
              onFocus={focusTop}
              hasTVPreferredFocus
            />
          </FocusGroup>
        </View>
        {CATEGORIES.map((category, index) => (
          <View key={category.tag} onLayout={sectionLayout(category.tag)}>
            <ErrorBoundary
              title={t('couldntShow', { name: category.label[language] })}
            >
              <CategoryRow
                category={category}
                index={index}
                active={isRowInWindow(index, rowFocus)}
                onPressStory={openStory}
                onFocusRow={focusRow}
              />
            </ErrorBoundary>
          </View>
        ))}
      </ScrollView>
    );
  };

  return <MainLayout current="Home">{renderContent()}</MainLayout>;
}
