import { StyleSheet } from 'react-native';
import { Theme } from '../../../../theme/theme';

export const makeStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      marginBottom: spacing.md,
    },
    story: {
      flex: 1,
    },
  });
