import React, {useMemo, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {formatShortDate} from '../../../i18n/formatDate';
import {useLanguage} from '../../../i18n/language';
import {autoDirection} from '../../../platform/textDirection/textDirection';
import {useStyles, useTheme} from '../../../theme/theme';
import {
  makeStyles,
  STORY_CARD_WIDTH,
  storyCardImageHeight,
  TITLE_LINES,
} from './StoryCard.styles';
import {StoryCardProps} from './StoryCard.types';

export function StoryCard({
  story,
  onPress,
  onFocus,
  hasTVPreferredFocus,
  width = STORY_CARD_WIDTH,
}: StoryCardProps) {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const language = useLanguage();
  const [focused, setFocused] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const cardWidth = theme.scale(width);
  const imageHeight = storyCardImageHeight(theme, width);

  const date = useMemo(
    () => formatShortDate(story.publishedAt, language),
    [language, story.publishedAt],
  );

  const meta = `${story.author} · ${date}`;
  const showImage = story.imageUrl !== null && !imageFailed;

  return (
    <Pressable
      onPress={() => onPress(story)}
      onFocus={() => {
        setFocused(true);
        onFocus?.(story);
      }}
      onBlur={() => setFocused(false)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${story.title}, ${meta}`}
      style={[styles.card, {width: cardWidth}, focused && styles.focused]}>
      <View style={[styles.image, {height: imageHeight}]}>
        {showImage && (
          <Image
            source={{uri: story.imageUrl!}}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
            style={{width: cardWidth, height: imageHeight}}
          />
        )}
      </View>
      <View style={styles.body}>
        <Text
          {...autoDirection}
          numberOfLines={TITLE_LINES}
          style={styles.title}>
          {story.title}
        </Text>
        <Text {...autoDirection} numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}
