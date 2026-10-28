import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

const BAR = 0.7;

export const makeStyles = ({
  colors,
  focus,
  lineHeight,
  radius,
  spacing,
}: Theme) => {
  const bar = (lineHeightPx: number) => ({
    height: Math.round(lineHeightPx * BAR),
    marginVertical: Math.round((lineHeightPx * (1 - BAR)) / 2),
    borderRadius: radius.sm,
    backgroundColor: colors.skeleton,
  });

  return StyleSheet.create({
    card: {
      borderRadius: radius.md,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      backgroundColor: colors.surfaceRaised,
    },
    body: {
      padding: spacing.md,
    },
    titleLine: {
      ...bar(lineHeight.body),
      width: '90%',
    },
    titleLineShort: {
      ...bar(lineHeight.body),
      width: '60%',
    },
    meta: {
      ...bar(lineHeight.caption),
      width: '40%',
      marginTop: spacing.sm + Math.round((lineHeight.caption * (1 - BAR)) / 2),
    },
  });
};
