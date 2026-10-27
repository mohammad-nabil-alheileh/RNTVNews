import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  safeArea,
  spacing,
}: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: safeArea.horizontal,
      paddingTop: spacing.xl,
      gap: spacing.xxl,
    },
    row: {
      flexDirection: 'row',
    },
    sectionTitle: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginBottom: spacing.sm,
    },
    accountName: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
      marginBottom: spacing.md,
    },
  });
