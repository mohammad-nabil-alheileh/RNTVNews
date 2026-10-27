import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { fetchArticle } from '../../api/devto';
import {
  getSavedArticle,
  removeSaved,
  saveArticle,
} from '../../api/savedStore';
import { getStory } from '../../api/storyStore';
import { ArticleActions } from '../../components/ArticleActions/ArticleActions';
import { ArticleBody } from '../../components/ArticleBody/ArticleBody';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog/ConfirmDialog';
import { useLoad } from '../../hooks/useLoad/useLoad';
import { useIsSaved } from '../../hooks/useIsSaved/useIsSaved';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { ScreenProps } from '../../types/navigation';
import { makeStyles } from './ArticleScreen.styles';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function ArticleScreen({ navigation, route }: ScreenProps<'Article'>) {
  const t = useTranslation();
  const { storyId, queue = [] } = route.params;
  const styles = useStyles(makeStyles);
  const saved = useIsSaved(storyId);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const load = useCallback(() => {
    const savedArticle = getSavedArticle(storyId);
    return savedArticle ? Promise.resolve(savedArticle) : fetchArticle(storyId);
  }, [storyId]);
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

  const toggleSaved = useCallback(() => {
    if (saved) {
      setConfirmingRemove(true);
    } else if (state.status === 'success') {
      saveArticle(state.data);
    }
  }, [saved, state]);
  const closeDialog = useCallback(() => setConfirmingRemove(false), []);
  const confirmRemove = useCallback(() => {
    removeSaved(storyId);
    setConfirmingRemove(false);
  }, [storyId]);

  return (
    <View style={styles.screen}>
      <ArticleActions
        onBack={goBack}
        onSave={toggleSaved}
        onNext={openNext}
        saved={saved}
        canSave={state.status === 'success'}
        hasNext={nextId !== undefined}
      />
      <ArticleBody
        story={story}
        state={state}
        onRetry={reload}
        onBack={goBack}
      />
      <ConfirmDialog
        visible={confirmingRemove}
        title={t('removeFromSaved')}
        message={story?.title}
        confirmLabel={t('remove')}
        cancelLabel={t('keep')}
        onConfirm={confirmRemove}
        onCancel={closeDialog}
      />
    </View>
  );
}
