import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../../theme/theme';

export const COVER_RATIO = 1000 / 420;

export const makeStyles = ({
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  radius,
  spacing,
}: Theme) =>
  StyleSheet.create({
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.headline,
      lineHeight: lineHeight.headline,
      fontWeight: '700',
    },
    meta: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginTop: spacing.sm,
    },
    cover: {
      marginTop: spacing.lg,
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.surfaceRaised,
    },
  });
