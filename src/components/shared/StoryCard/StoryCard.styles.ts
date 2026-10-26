import {StyleSheet} from 'react-native';
import {Theme} from '../../../theme/theme';

export const TITLE_LINES = 2;
export const STORY_CARD_WIDTH = 384;

export const storyCardImageHeight = (
  {scale}: Theme,
  width: number = STORY_CARD_WIDTH,
) => Math.round((scale(width) * 9) / 16);

export const storyCardHeight = (
  theme: Theme,
  width: number = STORY_CARD_WIDTH,
) =>
  storyCardImageHeight(theme, width) +
  theme.spacing.md * 2 +
  theme.lineHeight.body * TITLE_LINES +
  theme.spacing.sm +
  theme.lineHeight.caption +
  theme.focus.borderWidth * 2;

export const makeStyles = ({
  colors,
  focus,
  fontFamily,
  fontSize,
  lineHeight,
  radius,
  spacing,
}: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: radius.md,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    focused: {
      borderColor: colors.focus,
      transform: [{scale: focus.scale}],
    },
    image: {
      width: '100%',
      backgroundColor: colors.surfaceRaised,
    },
    body: {
      padding: spacing.md,
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      height: lineHeight.body * TITLE_LINES,
      fontWeight: '700',
    },
    meta: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.caption,
      lineHeight: lineHeight.caption,
      height: lineHeight.caption,
      marginTop: spacing.sm,
    },
  });
