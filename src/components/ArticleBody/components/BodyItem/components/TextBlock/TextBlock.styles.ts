import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../../theme/theme';

export const makeStyles = ({
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  monoFontFamily,
  radius,
  scale,
  spacing,
}: Theme) =>
  StyleSheet.create({
    paragraph: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.reading,
      lineHeight: lineHeight.reading,
    },
    heading: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
      fontWeight: '700',
      marginTop: spacing.md,
    },
    listItem: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.reading,
      lineHeight: lineHeight.reading,
      paddingStart: spacing.lg,
    },
    quote: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.reading,
      lineHeight: lineHeight.reading,
      fontStyle: 'italic',
      paddingStart: spacing.lg,
      borderStartWidth: scale(4),
      borderStartColor: colors.accent,
    },
    code: {
      color: colors.text,
      fontFamily: monoFontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      padding: spacing.md,
      borderRadius: radius.sm,
      backgroundColor: colors.background,
    },
  });
