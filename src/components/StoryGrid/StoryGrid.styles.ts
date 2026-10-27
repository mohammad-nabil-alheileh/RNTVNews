import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const COLUMNS = 4;
export const GRID_CARD_WIDTH = 414;

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    group: {
      height: '100%',
    },
    list: {
      height: '100%',
    },
    content: {
      paddingHorizontal: safeArea.horizontal,
      paddingTop: spacing.lg,
      paddingBottom: safeArea.vertical,
    },
    row: {
      gap: spacing.lg,
      marginBottom: spacing.lg,
    },
  });
