import { StyleSheet } from 'react-native';
import { keyboardWidth } from '../../components/SearchKeyboard/SearchKeyboard.styles';
import { Theme } from '../../theme/theme';

const QUERY_HEIGHT = 80;

export const makeStyles = (theme: Theme) => {
  const {
    colors,
    fontFamily,
    fontSize,
    lineHeight,
    radius,
    safeArea,
    scale,
    spacing,
  } = theme;
  return StyleSheet.create({
    screen: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.xxl,
      paddingHorizontal: safeArea.horizontal,
      paddingTop: spacing.lg,
    },
    left: {
      width: keyboardWidth(theme),
    },
    queryBox: {
      height: scale(QUERY_HEIGHT),
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
    },
    query: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
    },
    placeholder: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
    },
    right: {
      flex: 1,
    },
    summary: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      height: lineHeight.body,
      marginBottom: spacing.md,
    },
    results: {
      flex: 1,
    },
  });
};
