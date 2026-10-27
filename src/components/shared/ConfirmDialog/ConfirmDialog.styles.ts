import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

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
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    box: {
      minWidth: scale(720),
      padding: spacing.xxl,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
      fontWeight: '700',
      textAlign: 'center',
    },
    message: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginTop: spacing.xl,
    },
  });
