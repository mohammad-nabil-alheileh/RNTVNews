import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  radius,
  safeArea,
  scale,
  spacing,
}: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: safeArea.horizontal,
      paddingVertical: safeArea.vertical,
      gap: scale(96),
    },
    info: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.headline,
      lineHeight: lineHeight.headline,
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    storyWaiting: {
      color: colors.accent,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginBottom: spacing.lg,
    },
    actions: {
      flexDirection: 'row',
      marginTop: spacing.xxl,
    },
    qrFrame: {
      padding: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.qrLight,
    },
  });
