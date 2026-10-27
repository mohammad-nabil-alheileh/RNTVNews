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
      gap: spacing.xl,
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.headline,
      lineHeight: lineHeight.headline,
      fontWeight: '700',
    },
    actions: {
      flexDirection: 'row',
    },
  });
