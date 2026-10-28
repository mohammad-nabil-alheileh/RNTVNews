import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';
import { TOP_STORY_HEIGHT } from '../TopStory/TopStory.styles';

export const makeStyles = ({
  colors,
  focus,
  lineHeight,
  radius,
  scale,
  spacing,
}: Theme) => {
  const bar = (lineHeightPx: number, width: number) => ({
    height: Math.round(lineHeightPx * 0.7),
    marginTop: Math.round(lineHeightPx * 0.3),
    width: scale(width),
    borderRadius: radius.sm,
    backgroundColor: colors.skeleton,
  });

  return StyleSheet.create({
    container: {
      height: scale(TOP_STORY_HEIGHT),
      borderRadius: radius.lg,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
      backgroundColor: colors.surfaceRaised,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    panel: {
      padding: spacing.xl,
      backgroundColor: colors.surface,
    },
    label: bar(lineHeight.caption, 160),
    title: bar(lineHeight.headline, 1100),
    titleShort: bar(lineHeight.headline, 700),
    meta: bar(lineHeight.caption, 320),
  });
};
