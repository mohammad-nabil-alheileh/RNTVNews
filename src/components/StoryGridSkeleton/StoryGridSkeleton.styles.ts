import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    grid: {
      height: '100%',
      overflow: 'hidden',
      paddingHorizontal: safeArea.horizontal,
      paddingTop: spacing.lg,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginBottom: spacing.lg,
    },
  });
