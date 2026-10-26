import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const ACTIONS_WIDTH = 320;

export const makeStyles = ({ safeArea, scale, spacing }: Theme) =>
  StyleSheet.create({
    column: {
      width: scale(ACTIONS_WIDTH),
      paddingTop: safeArea.vertical,
      gap: spacing.md,
    },
  });
