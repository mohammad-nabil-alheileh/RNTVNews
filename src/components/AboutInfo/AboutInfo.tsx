import React from 'react';
import { Text, View } from 'react-native';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { makeStyles } from './AboutInfo.styles';
import { AboutInfoProps } from './AboutInfo.types';

export function AboutInfo({ rows }: AboutInfoProps) {
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.list}>
      {rows.map(row => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={`${row.label}: ${row.value}`}
          style={styles.row}
        >
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}
