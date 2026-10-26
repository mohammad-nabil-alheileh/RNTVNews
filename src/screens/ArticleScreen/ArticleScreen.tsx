import React, { useCallback } from 'react';
import { View } from 'react-native';
import { fetchArticle } from '../../api/devto';
import { getStory } from '../../api/storyStore';
import { ArticleActions } from '../../components/ArticleActions/ArticleActions';
import { ArticleBody } from '../../components/ArticleBody/ArticleBody';
import { useLoad } from '../../hooks/useLoad/useLoad';
import { useStyles } from '../../theme/theme';
import { ScreenProps } from '../../types/navigation';
import { makeStyles } from './ArticleScreen.styles';

export function ArticleScreen({ navigation, route }: ScreenProps<'Article'>) {
  const { storyId, queue = [] } = route.params;
  const styles = useStyles(makeStyles);

  const load = useCallback(() => fetchArticle(storyId), [storyId]);
  const { state, reload } = useLoad(load);
  const story = state.status === 'success' ? state.data : getStory(storyId);

  const position = queue.indexOf(storyId);
  const nextId = position >= 0 ? queue[position + 1] : undefined;

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const openNext = useCallback(() => {
    if (nextId !== undefined) {
      navigation.replace('Article', { storyId: nextId, queue });
    }
  }, [navigation, nextId, queue]);
  const save = useCallback(() => {}, []);

  return (
    <View style={styles.screen}>
      <ArticleActions
        onBack={goBack}
        onSave={save}
        onNext={openNext}
        hasNext={nextId !== undefined}
      />
      <ArticleBody
        story={story}
        state={state}
        onRetry={reload}
        onBack={goBack}
      />
    </View>
  );
}
