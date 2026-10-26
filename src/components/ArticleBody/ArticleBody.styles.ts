import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const BODY_WIDTH = 1200;
const STATUS_MIN_HEIGHT = 400;

export const bodyContentWidth = ({ focus, scale, spacing }: Theme) =>
  scale(BODY_WIDTH) - 2 * (spacing.md + focus.borderWidth);

export const makeStyles = ({ safeArea, scale }: Theme) =>
  StyleSheet.create({
    group: {
      height: '100%',
    },
    list: {
      height: '100%',
      width: scale(BODY_WIDTH),
    },
    content: {
      paddingVertical: safeArea.vertical,
    },
    status: {
      minHeight: scale(STATUS_MIN_HEIGHT),
    },
  });
