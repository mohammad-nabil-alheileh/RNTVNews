import React from 'react';
import { useStyles } from '../../theme/theme';
import { FocusableButton } from '../shared/FocusableButton/FocusableButton';
import { FocusGroup } from '../shared/FocusGroup/FocusGroup';
import { makeStyles } from './ArticleActions.styles';
import { ArticleActionsProps } from './ArticleActions.types';

export function ArticleActions({
  onBack,
  onSave,
  onNext,
  hasNext,
}: ArticleActionsProps) {
  const styles = useStyles(makeStyles);

  return (
    <FocusGroup remember trap={['left', 'up', 'down']} style={styles.column}>
      <FocusableButton label="Back" onPress={onBack} />
      <FocusableButton label="Save" onPress={onSave} />
      <FocusableButton
        label="Next story"
        onPress={onNext}
        disabled={!hasNext}
      />
    </FocusGroup>
  );
}
