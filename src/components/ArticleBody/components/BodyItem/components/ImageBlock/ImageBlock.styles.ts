import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../../theme/theme';

export const MAX_IMAGE_HEIGHT = 640;
export const FALLBACK_RATIO = 16 / 9;

export const makeStyles = ({ colors, radius }: Theme) =>
  StyleSheet.create({
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.surfaceRaised,
    },
  });
