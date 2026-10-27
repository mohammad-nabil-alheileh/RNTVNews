import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: safeArea.horizontal,
      paddingTop: spacing.xl,
      gap: spacing.xxl,
    },
    about: {
      flexDirection: 'row',
    },
  });
