import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const COLUMNS = 6;
export const KEY_SIZE = 80;
export const KEY_GAP = 8;

export const keyboardWidth = ({ scale }: Theme) =>
  scale(KEY_SIZE * COLUMNS + KEY_GAP * (COLUMNS - 1));

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    keys: {
      width: keyboardWidth(theme),
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.scale(KEY_GAP),
    },
  });
