import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';
import { storyCardHeight } from '../shared/StoryCard/StoryCard.styles';

export const makeStyles = (theme: Theme) => {
  const { colors, fontFamily, fontSize, lineHeight, safeArea, spacing } = theme;

  return StyleSheet.create({
    title: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize.title,
      lineHeight: lineHeight.title,
      fontWeight: '700',
      marginHorizontal: safeArea.horizontal,
    },
    body: {
      height: storyCardHeight(theme) + spacing.lg * 2,
    },
  });
};
