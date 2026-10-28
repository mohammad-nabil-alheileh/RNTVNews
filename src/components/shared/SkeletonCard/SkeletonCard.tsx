import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import {
  STORY_CARD_WIDTH,
  storyCardHeight,
  storyCardImageHeight,
} from '../StoryCard/StoryCard.styles';
import { makeStyles } from './SkeletonCard.styles';
import { SkeletonCardProps } from './SkeletonCard.types';

export function SkeletonCard({ width = STORY_CARD_WIDTH }: SkeletonCardProps) {
  const styles = useStyles(makeStyles);
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          width: theme.scale(width),
          height: storyCardHeight(theme, width),
        },
      ]}
    >
      <View
        style={[styles.image, { height: storyCardImageHeight(theme, width) }]}
      />
      <View style={styles.body}>
        <View style={styles.titleLine} />
        <View style={styles.titleLineShort} />
        <View style={styles.meta} />
      </View>
    </View>
  );
}
