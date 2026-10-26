import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const makeStyles = ({ safeArea, spacing }: Theme) =>
  StyleSheet.create({
    content: {
      paddingTop: spacing.lg,
      paddingBottom: safeArea.vertical,
      gap: spacing.xxl,
    },
    topStory: {
      marginHorizontal: safeArea.horizontal,
    },
  });
