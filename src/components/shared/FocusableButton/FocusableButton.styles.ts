import {StyleSheet} from 'react-native';
import {Theme} from '../../../theme/theme';

export const makeStyles = ({
  colors,
  focus,
  fontFamily,
  fontSize,
  lineHeight,
  radius,
  spacing,
}: Theme) =>
  StyleSheet.create({
    button: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.md,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
      backgroundColor: colors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selected: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accent,
    },
    focused: {
      backgroundColor: colors.focus,
      borderColor: colors.focus,
      transform: [{scale: focus.scale}],
    },
    disabled: {
      opacity: 0.4,
    },
    label: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.body,
      lineHeight: lineHeight.body,
      fontWeight: '600',
    },
    labelFocused: {
      color: colors.textOnFocus,
    },
  });
