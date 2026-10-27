import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  radius,
  scale,
  spacing,
}: Theme) =>
  StyleSheet.create({
    list: {
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.lg,
    },
    label: {
      width: scale(320),
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
    },
    value: {
      flex: 1,
      color: colors.text,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      fontWeight: '600',
    },
  });
