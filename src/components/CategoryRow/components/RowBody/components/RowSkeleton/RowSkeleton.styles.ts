import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: spacing.lg,
      paddingHorizontal: safeArea.horizontal,
      paddingVertical: spacing.lg,
      overflow: 'hidden',
    },
  });
