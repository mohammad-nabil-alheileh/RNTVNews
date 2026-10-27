import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    box: {
      backgroundColor: colors.qrLight,
    },
    dark: {
      position: 'absolute',
      backgroundColor: colors.qrDark,
    },
  });
