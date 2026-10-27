import React, { memo } from 'react';
import { useStyles } from '../../../../hooks/useStyles/useStyles';
import { FocusableButton } from '../../../shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../../../shared/FocusGroup/FocusGroup';
import { StoryRow } from '../../../shared/StoryRow/StoryRow';
import { makeStyles } from './SavedItem.styles';
import { SavedItemProps } from './SavedItem.types';
import { useTranslation } from '../../../../hooks/useTranslation/useTranslation';

function SavedItemView({
  article,
  index,
  onOpen,
  onRemove,
  onFocusRow,
  hasTVPreferredFocus,
}: SavedItemProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);

  return (
    <FocusGroup trap={['left', 'right']} style={styles.row}>
      <StoryRow
        story={article}
        onPress={() => onOpen(article)}
        onFocus={() => onFocusRow(index)}
        hasTVPreferredFocus={hasTVPreferredFocus}
        style={styles.story}
      />
      <FocusableButton
        label={t('remove')}
        onPress={() => onRemove(article, index)}
        onFocus={() => onFocusRow(index)}
      />
    </FocusGroup>
  );
}

export const SavedItem = memo(SavedItemView);
