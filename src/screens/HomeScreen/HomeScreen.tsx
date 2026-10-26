import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { CATEGORIES } from '../../api/categories';
import { fetchTopStories } from '../../api/devto';
import { CategoryRow } from '../../components/CategoryRow/CategoryRow';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary/ErrorBoundary';
import { FocusGroup } from '../../components/shared/FocusGroup/FocusGroup';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { TopStory } from '../../components/TopStory/TopStory';
import { useCenteredScroll } from '../../hooks/useCenteredScroll/useCenteredScroll';
import { useLoad } from '../../hooks/useLoad/useLoad';
import { useLanguage } from '../../i18n/language';
import { useStyles } from '../../theme/theme';
import { ScreenProps } from '../../types/navigation';
import { Story } from '../../types/story';
import { makeStyles } from './HomeScreen.styles';

const TOP_SECTION = 'top';

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const { state, reload } = useLoad(fetchTopStories);
  const { scrollRef, onLayout, sectionLayout, centerOn } = useCenteredScroll();

  const openStory = useCallback(
    (story: Story, list: Story[]) =>
      navigation.navigate('Article', {
        storyId: story.id,
        queue: list.map(item => item.id),
      }),
    [navigation],
  );

  const renderContent = () => {
    if (state.status === 'loading') {
      return (
        <StatusView
          kind="loading"
          title="Loading stories…"
          actionLabel="Reload"
          onAction={reload}
          hasTVPreferredFocus
        />
      );
    }

    if (state.status === 'offline') {
      return (
        <StatusView
          kind="offline"
          title="No connection"
          message="Check your network and try again."
          actionLabel="Retry"
          onAction={reload}
          hasTVPreferredFocus
        />
      );
    }

    if (state.status === 'error') {
      return (
        <StatusView
          kind="error"
          title="Couldn't load stories"
          message={state.error}
          actionLabel="Retry"
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
          title="No stories right now"
          actionLabel="Retry"
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
              onFocus={() => centerOn(TOP_SECTION)}
              hasTVPreferredFocus
            />
          </FocusGroup>
        </View>
        {CATEGORIES.map(category => (
          <View key={category.tag} onLayout={sectionLayout(category.tag)}>
            <ErrorBoundary title={`Couldn't show ${category.label[language]}`}>
              <CategoryRow
                category={category}
                onPressStory={openStory}
                onFocus={() => centerOn(category.tag)}
              />
            </ErrorBoundary>
          </View>
        ))}
      </ScrollView>
    );
  };

  return <MainLayout current="Home">{renderContent()}</MainLayout>;
}
