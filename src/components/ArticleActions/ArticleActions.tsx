import React from 'react';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { FocusableButton } from '../shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { makeStyles } from './ArticleActions.styles';
import { ArticleActionsProps } from './ArticleActions.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function ArticleActions({
  onBack,
  onSave,
  onNext,
  saved,
  canSave,
  hasNext,
}: ArticleActionsProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);

  return (
    <FocusGroup remember trap={['left', 'up', 'down']} style={styles.column}>
      <FocusableButton label={t('back')} onPress={onBack} />
      <FocusableButton
        label={saved ? t('saved') : t('save')}
        onPress={onSave}
        selected={saved}
        disabled={!saved && !canSave}
      />
      <FocusableButton
        label={t('nextStory')}
        onPress={onNext}
        disabled={!hasNext}
      />
    </FocusGroup>
  );
}
