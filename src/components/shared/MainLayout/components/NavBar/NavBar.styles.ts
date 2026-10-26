import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingHorizontal: safeArea.horizontal,
      paddingTop: safeArea.vertical,
      paddingBottom: spacing.md,
    },
  });
