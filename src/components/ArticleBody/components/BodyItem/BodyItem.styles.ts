import { StyleSheet } from 'react-native';
import { Theme } from '../../../../theme/theme';

export const makeStyles = ({ colors, focus, radius, spacing }: Theme) =>
  StyleSheet.create({
    item: {
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderRadius: radius.md,
      borderWidth: focus.borderWidth,
      borderColor: colors.transparent,
    },
    focused: {
      borderColor: colors.focus,
      backgroundColor: colors.surface,
    },
  });
