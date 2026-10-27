import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({
  colors,
  fontFamily,
  monoFontFamily,
  fontSize,
  lineHeight,
  scale,
  spacing,
}: Theme) =>
  StyleSheet.create({
    notice: {
      color: colors.accent,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginBottom: spacing.lg,
    },
    step: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
    },
    address: {
      color: colors.accent,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
      writingDirection: 'ltr',
    },
    code: {
      color: colors.text,
      fontFamily: monoFontFamily,
      fontSize: scale(88),
      lineHeight: scale(110),
      fontWeight: '700',
      letterSpacing: scale(8),
      marginTop: spacing.sm,
      writingDirection: 'ltr',
    },
    problem: {
      color: colors.error,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginTop: spacing.md,
    },
    countdown: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginTop: spacing.md,
    },
  });
