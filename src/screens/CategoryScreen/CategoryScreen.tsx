import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { CATEGORIES } from '../../api/categories';
import { fetchStoriesByTag } from '../../api/devto';
import { CategoryTabs } from '../../components/CategoryTabs/CategoryTabs';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { StoryGrid } from '../../components/StoryGrid/StoryGrid';
import { useCachedList } from '../../hooks/useCachedList/useCachedList';
import { onBack } from '../../platform/back/back';
import { requestFocus } from '../../platform/requestFocus/requestFocus';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { ScreenProps } from '../../types/navigation';
import { Story } from '../../types/story';
import { makeStyles } from './CategoryScreen.styles';
import { FocusArea } from './CategoryScreen.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function CategoryScreen({ navigation, route }: ScreenProps<'Category'>) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const [tag, setTag] = useState(route.params.tag ?? CATEGORIES[0].tag);
  const focusArea = useRef<FocusArea>('tabs');
  const selectedTabRef = useRef<View>(null);

  const load = useCallback(() => fetchStoriesByTag(tag), [tag]);
  const { state, reload } = useCachedList(tag, load);

  useFocusEffect(
    useCallback(
      () =>
        onBack(() => {
          if (focusArea.current !== 'grid') {
            return false;
          }
          requestFocus(selectedTabRef.current);
          return true;
        }),
      [],
    ),
  );

  const focusTabs = useCallback(() => {
    focusArea.current = 'tabs';
  }, []);
  const focusGrid = useCallback(() => {
    focusArea.current = 'grid';
  }, []);

  const openStory = useCallback(
    (story: Story, list: Story[]) =>
      navigation.navigate('Article', {
        storyId: story.id,
        queue: list.map(item => item.id),
      }),
    [navigation],
  );

  const renderGrid = () => {
    switch (state.status) {
      case 'loading':
        return (
          <StatusView
            kind="loading"
            title={t('loadingStories')}
            actionLabel={t('reload')}
            onAction={reload}
          />
        );
      case 'offline':
        return (
          <StatusView
            kind="offline"
            title={t('noConnection')}
            message={t('checkNetwork')}
            actionLabel={t('retry')}
            onAction={reload}
          />
        );
      case 'error':
        return (
          <StatusView
            kind="error"
            title={t('couldntLoadStories')}
            message={state.error}
            actionLabel={t('retry')}
            onAction={reload}
          />
        );
      case 'success':
        if (state.data.length === 0) {
          return (
            <StatusView
              kind="empty"
              title={t('noStoriesInCategory')}
              actionLabel={t('retry')}
              onAction={reload}
            />
          );
        }
        return (
          <StoryGrid
            stories={state.data}
            onOpen={openStory}
            onFocusStory={focusGrid}
          />
        );
    }
  };

  return (
    <MainLayout current="Category">
      <CategoryTabs
        selectedTag={tag}
        onSelect={setTag}
        onFocusTab={focusTabs}
        selectedRef={selectedTabRef}
      />
      <View style={styles.body}>{renderGrid()}</View>
    </MainLayout>
  );
}
