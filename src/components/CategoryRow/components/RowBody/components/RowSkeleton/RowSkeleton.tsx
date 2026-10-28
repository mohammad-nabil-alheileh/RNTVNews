import React from 'react';
import { useStyles } from '../../../../../../hooks/useStyles/useStyles';
import { Skeleton } from '../../../../../shared/Skeleton/Skeleton';
import { SkeletonCard } from '../../../../../shared/SkeletonCard/SkeletonCard';
import { makeStyles } from './RowSkeleton.styles';
import { RowSkeletonProps } from './RowSkeleton.types';

export function RowSkeleton({ count = 5 }: RowSkeletonProps) {
  const styles = useStyles(makeStyles);

  return (
    <Skeleton style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Skeleton>
  );
}
