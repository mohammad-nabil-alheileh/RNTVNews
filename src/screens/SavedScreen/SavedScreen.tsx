import React, { useCallback, useState } from 'react';
import { removeSaved } from '../../api/savedStore';
import { SavedList } from '../../components/SavedList/SavedList';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog/ConfirmDialog';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { useSaved } from '../../hooks/useSaved/useSaved';
import { ScreenProps } from '../../types/navigation';
import { Article } from '../../types/story';
import { PendingRemoval } from './SavedScreen.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function SavedScreen({ navigation }: ScreenProps<'Saved'>) {
  const t = useTranslation();
  const { loaded, items } = useSaved();
  const [pending, setPending] = useState<PendingRemoval | null>(null);
  const [preferredIndex, setPreferredIndex] = useState(0);

  const openArticle = useCallback(
    (article: Article) =>
      navigation.navigate('Article', {
        storyId: article.id,
        queue: items.map(item => item.article.id),
      }),
    [navigation, items],
  );

  const askRemove = useCallback(
    (article: Article, index: number) => setPending({ article, index }),
    [],
  );
  const cancelRemove = useCallback(() => setPending(null), []);
  const confirmRemove = useCallback(() => {
    if (!pending) {
      return;
    }
    setPreferredIndex(Math.max(0, Math.min(pending.index, items.length - 2)));
    removeSaved(pending.article.id);
    setPending(null);
  }, [pending, items.length]);

  const renderContent = () => {
    if (!loaded) {
      return (
        <StatusView
          kind="loading"
          title={t('loadingSaved')}
          actionLabel={t('back')}
          onAction={() => navigation.goBack()}
          hasTVPreferredFocus
        />
      );
    }
    if (items.length === 0) {
      return (
        <StatusView
          kind="empty"
          title={t('noSaved')}
          message={t('noSavedHint')}
          actionLabel={t('browseStories')}
          onAction={() => navigation.goBack()}
          hasTVPreferredFocus
        />
      );
    }
    return (
      <SavedList
        items={items}
        preferredIndex={preferredIndex}
        onOpen={openArticle}
        onRemove={askRemove}
      />
    );
  };

  return (
    <MainLayout current="Saved">
      {renderContent()}
      <ConfirmDialog
        visible={pending !== null}
        title={t('removeFromSaved')}
        message={pending?.article.title}
        confirmLabel={t('remove')}
        cancelLabel={t('keep')}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
      />
    </MainLayout>
  );
}
