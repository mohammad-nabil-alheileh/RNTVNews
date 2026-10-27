import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../../theme/theme';

export const makeStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    gap: {
      width: spacing.lg,
    },
  });
