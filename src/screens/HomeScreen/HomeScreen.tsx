import React, { ReactElement, useCallback, useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { CATEGORIES } from '../../api/categories';
import { fetchStoriesByTag, fetchTopStories } from '../../api/devto';
import { prefetchLists } from '../../api/listCache';
import { clearRowMemory } from '../../api/rowMemory';
import { CategoryRow } from '../../components/CategoryRow/CategoryRow';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary/ErrorBoundary';
import { FocusGroup } from '../../components/shared/FocusGroup/FocusGroup';
import { MeasuredCell } from '../../components/shared/MeasuredCell/MeasuredCell';
import { MeasuredCellContext } from '../../components/shared/MeasuredCell/MeasuredCell.context';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { TopStory } from '../../components/TopStory/TopStory';
import { TopStorySkeleton } from '../../components/TopStorySkeleton/TopStorySkeleton';
import { useCenteredList } from '../../hooks/useCenteredList/useCenteredList';
import { useCachedList } from '../../hooks/useCachedList/useCachedList';
import { useListCacheReady } from '../../hooks/useListCacheReady/useListCacheReady';
import { useLanguage } from '../../hooks/useLanguage/useLanguage';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { scrollListTo } from '../../platform/smoothScroll/smoothScroll';
import { Category } from '../../types/category';
import { ScreenProps } from '../../types/navigation';
import { Story } from '../../types/story';
import { makeStyles } from './HomeScreen.styles';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

const keyOf = (category: Category) => category.tag;

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const ready = useListCacheReady();
  const { state, reload } = useCachedList('top', fetchTopStories);
  const { listRef, onLayout, recordCell, centerOn } =
    useCenteredList<Category>();

  const focusRow = useCallback(
    (_tag: string, index: number) => centerOn(index),
    [centerOn],
  );

  const focusTop = useCallback(
    () => scrollListTo(listRef.current, 0),
    [listRef],
  );

  useEffect(() => clearRowMemory, []);

  const openStory = useCallback(
    (story: Story, list: Story[]) =>
      navigation.navigate('Article', {
        storyId: story.id,
        queue: list.map(item => item.id),
      }),
    [navigation],
  );

  const renderRow = useCallback<ListRenderItem<Category>>(
    ({ item, index }) => (
      <ErrorBoundary title={t('couldntShow', { name: item.label[language] })}>
        <CategoryRow
          category={item}
          index={index}
          onPressStory={openStory}
          onFocusRow={focusRow}
        />
      </ErrorBoundary>
    ),
    [t, language, openStory, focusRow],
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

  const renderList = (header: ReactElement) => (
    <MeasuredCellContext.Provider value={recordCell}>
      <FlatList
        ref={listRef}
        onLayout={onLayout}
        data={CATEGORIES}
        keyExtractor={keyOf}
        renderItem={renderRow}
        CellRendererComponent={MeasuredCell}
        ListHeaderComponent={header}
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
    </MeasuredCellContext.Provider>
  );

  const renderContent = () => {
    if (!ready) {
      return null;
    }
    if (state.status === 'loading') {
      return renderList(<TopStorySkeleton style={styles.topStory} />);
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

    return renderList(
      <FocusGroup trap={['left', 'right']} style={styles.topStory}>
        <TopStory
          story={top}
          onPress={story => openStory(story, state.data)}
          onFocus={focusTop}
          hasTVPreferredFocus
        />
      </FocusGroup>,
    );
  };

  return <MainLayout current="Home">{renderContent()}</MainLayout>;
}
