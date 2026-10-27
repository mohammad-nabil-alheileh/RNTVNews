import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    group: {
      height: '100%',
    },
    list: {
      height: '100%',
    },
    content: {
      paddingBottom: safeArea.vertical,
    },
    item: {
      marginBottom: spacing.md,
    },
  });
