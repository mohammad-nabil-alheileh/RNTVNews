import {StyleSheet} from 'react-native';
import {Theme} from '../../../theme/theme';

export const makeStyles = ({
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  scale,
  spacing,
}: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xxl,
    },
    indicator: {
      marginBottom: spacing.lg,
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
      fontWeight: '700',
      textAlign: 'center',
    },
    titleError: {
      color: colors.error,
    },
    message: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      textAlign: 'center',
      marginTop: spacing.sm,
      maxWidth: scale(900),
    },
    action: {
      marginTop: spacing.xl,
    },
  });
