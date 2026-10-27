import { StyleSheet } from 'react-native';
import { Theme } from '../../../../theme/theme';
import { KEY_GAP, KEY_SIZE } from '../../SearchKeyboard.styles';

export const makeStyles = ({ scale }: Theme) =>
  StyleSheet.create({
    key: {
      width: scale(KEY_SIZE),
      height: scale(KEY_SIZE),
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    wide: {
      width: scale(KEY_SIZE * 3 + KEY_GAP * 2),
    },
  });
