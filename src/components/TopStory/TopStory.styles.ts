import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const TITLE_LINES = 2;
export const DESCRIPTION_LINES = 2;

export const makeStyles = ({
  colors,
  focus,
  fontFamily,
  fontSize,
  lineHeight,
  radius,
  scale,
  spacing,
}: Theme) =>
  StyleSheet.create({
    container: {
      height: scale(560),
      borderRadius: radius.lg,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
      backgroundColor: colors.surfaceRaised,
      overflow: 'hidden',
    },
    focused: {
      borderColor: colors.focus,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    panel: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      padding: spacing.xl,
      backgroundColor: colors.overlay,
    },
    label: {
      color: colors.accent,
      fontFamily,
      fontSize: fontSize.caption,
      lineHeight: lineHeight.caption,
      fontWeight: '700',
    },
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.headline,
      lineHeight: lineHeight.headline,
      fontWeight: '700',
      marginTop: spacing.xs,
      maxWidth: scale(1300),
    },
    description: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      marginTop: spacing.sm,
      maxWidth: scale(1300),
    },
    meta: {
      color: colors.textMuted,
      fontFamily,
      fontSize: fontSize.caption,
      lineHeight: lineHeight.caption,
      marginTop: spacing.sm,
    },
  });
