import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ focus, safeArea, spacing }: Theme) =>
  StyleSheet.create({
    tabs: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingHorizontal: safeArea.horizontal,
      paddingVertical: spacing.lg - focus.borderWidth,
    },
  });
