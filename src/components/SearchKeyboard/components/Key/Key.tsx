import React, { memo } from 'react';
import { useStyles } from '../../../../hooks/useStyles/useStyles';
import { FocusableButton } from '../../../shared/FocusableButton/FocusableButton';
import { makeStyles } from './Key.styles';
import { KeyProps } from './Key.types';

function KeyView({
  label,
  value,
  onPress,
  wide,
  hasTVPreferredFocus,
}: KeyProps) {
  const styles = useStyles(makeStyles);

  return (
    <FocusableButton
      label={label}
      onPress={() => onPress(value)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={[styles.key, wide && styles.wide]}
    />
  );
}

export const Key = memo(KeyView);
