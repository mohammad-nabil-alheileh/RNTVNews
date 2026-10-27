import { StyleSheet } from 'react-native';
import { Theme } from '../../../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    list: {
      paddingHorizontal: safeArea.horizontal,
      paddingVertical: spacing.lg,
    },
  });
