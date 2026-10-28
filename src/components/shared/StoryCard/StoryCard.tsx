import React, { memo, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { sizedImageUrl } from '../../../utils/sizedImageUrl/sizedImageUrl';
import { formatShortDate } from '../../../utils/formatShortDate/formatShortDate';
import { useLanguage } from '../../../hooks/useLanguage/useLanguage';
import { autoDirection } from '../../../platform/textDirection/textDirection';
import { preferredFocusProps } from '../../../platform/preferredFocus/preferredFocus';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import {
  makeStyles,
  STORY_CARD_WIDTH,
  storyCardImageHeight,
  TITLE_LINES,
} from './StoryCard.styles';
import { StoryCardProps } from './StoryCard.types';
import { useImageFade } from '../../../platform/imageFade/imageFade';
import { useImageFailure } from '../../../hooks/useImageFailure/useImageFailure';

function StoryCardView({
  story,
  onPress,
  onFocus,
  hasTVPreferredFocus,
  width = STORY_CARD_WIDTH,
  ref,
}: StoryCardProps) {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const language = useLanguage();
  const [focused, setFocused] = useState(false);
  const [imageFailed, markImageFailed] = useImageFailure();
  const imageFade = useImageFade();

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
      ref={ref}
      onPress={() => onPress(story)}
      onFocus={() => {
        setFocused(true);
        onFocus?.(story);
      }}
      onBlur={() => setFocused(false)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      {...preferredFocusProps(hasTVPreferredFocus)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${story.title}, ${meta}`}
      style={[styles.card, { width: cardWidth }, focused && styles.focused]}
    >
      <View style={[styles.image, { height: imageHeight }]}>
        {showImage && (
          <Image
            {...imageFade}
            source={{
              uri: sizedImageUrl(story.imageUrl!, cardWidth, imageHeight),
            }}
            resizeMode="cover"
            resizeMethod="resize"
            onError={markImageFailed}
            style={{ width: cardWidth, height: imageHeight }}
          />
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.titleBox}>
          <Text
            {...autoDirection}
            numberOfLines={TITLE_LINES}
            ellipsizeMode="tail"
            style={styles.title}
          >
            {story.title}
          </Text>
        </View>
        <Text {...autoDirection} numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}

export const StoryCard = memo(StoryCardView);
