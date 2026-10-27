import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const THUMB_WIDTH = 256;
export const TITLE_LINES = 2;

export const thumbSize = ({ scale }: Theme) => {
  const width = scale(THUMB_WIDTH);
  return { width, height: Math.round((width * 9) / 16) };
};

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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      padding: spacing.sm,
      borderRadius: radius.md,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
      backgroundColor: colors.surface,
    },
    focused: {
      borderColor: colors.focus,
      backgroundColor: colors.surfaceRaised,
    },
    thumb: {
      borderRadius: radius.sm,
      overflow: 'hidden',
      backgroundColor: colors.surfaceRaised,
    },
    text: {
      flex: 1,
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
