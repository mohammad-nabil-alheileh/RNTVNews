import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../../../../../hooks/useStyles/useStyles';
import { makeStyles } from './RowGap.styles';

export function RowGap() {
  const styles = useStyles(makeStyles);
  return <View style={styles.gap} />;
}
