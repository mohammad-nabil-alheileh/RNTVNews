import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { Skeleton } from '../shared/Skeleton/Skeleton';
import { SkeletonCard } from '../shared/SkeletonCard/SkeletonCard';
import { COLUMNS, GRID_CARD_WIDTH } from '../StoryGrid/StoryGrid.styles';
import { makeStyles } from './StoryGridSkeleton.styles';
import { StoryGridSkeletonProps } from './StoryGridSkeleton.types';

export function StoryGridSkeleton({ rows = 2 }: StoryGridSkeletonProps) {
  const styles = useStyles(makeStyles);

  return (
    <Skeleton style={styles.grid}>
      {Array.from({ length: rows }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: COLUMNS }, (__, column) => (
            <SkeletonCard key={column} width={GRID_CARD_WIDTH} />
          ))}
        </View>
      ))}
    </Skeleton>
  );
}
