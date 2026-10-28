import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { Skeleton } from '../shared/Skeleton/Skeleton';
import { makeStyles } from './TopStorySkeleton.styles';
import { TopStorySkeletonProps } from './TopStorySkeleton.types';

export function TopStorySkeleton({ style }: TopStorySkeletonProps) {
  const styles = useStyles(makeStyles);

  return (
    <Skeleton style={[styles.container, style]}>
      <View style={styles.panel}>
        <View style={styles.label} />
        <View style={styles.title} />
        <View style={styles.titleShort} />
        <View style={styles.meta} />
      </View>
    </Skeleton>
  );
}
