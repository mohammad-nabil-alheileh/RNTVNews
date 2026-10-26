import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: safeArea.horizontal,
      gap: spacing.xxl,
    },
  });
