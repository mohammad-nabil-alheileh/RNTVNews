import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { sizedImageUrl } from '../../utils/sizedImageUrl/sizedImageUrl';
import { formatShortDate } from '../../utils/formatShortDate/formatShortDate';
import { useLanguage } from '../../hooks/useLanguage/useLanguage';
import { autoDirection } from '../../platform/textDirection/textDirection';
import { preferredFocusProps } from '../../platform/preferredFocus/preferredFocus';
import { useStyles } from '../../hooks/useStyles/useStyles';
import { useTheme } from '../../hooks/useTheme/useTheme';
import {
  DESCRIPTION_LINES,
  makeStyles,
  TITLE_LINES,
  TOP_STORY_HEIGHT,
  TOP_STORY_WIDTH,
} from './TopStory.styles';
import { TopStoryProps } from './TopStory.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';
import { useImageFailure } from '../../hooks/useImageFailure/useImageFailure';

export function TopStory({
  story,
  onPress,
  onFocus,
  hasTVPreferredFocus,
}: TopStoryProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const language = useLanguage();
  const [focused, setFocused] = useState(false);
  const [imageFailed, markImageFailed] = useImageFailure();

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
        onFocus?.();
      }}
      onBlur={() => setFocused(false)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      {...preferredFocusProps(hasTVPreferredFocus)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={t('topStoryLabel', { title: story.title, meta })}
      style={[styles.container, focused && styles.focused]}
    >
      {showImage && (
        <Image
          source={{
            uri: sizedImageUrl(
              story.imageUrl!,
              theme.scale(TOP_STORY_WIDTH),
              theme.scale(TOP_STORY_HEIGHT),
            ),
          }}
          resizeMode="cover"
          resizeMethod="resize"
          fadeDuration={0}
          onError={markImageFailed}
          style={styles.image}
        />
      )}
      <View style={styles.panel}>
        <Text style={styles.label}>{t('topStory')}</Text>
        <Text
          {...autoDirection}
          numberOfLines={TITLE_LINES}
          style={styles.title}
        >
          {story.title}
        </Text>
        {story.description ? (
          <Text
            {...autoDirection}
            numberOfLines={DESCRIPTION_LINES}
            style={styles.description}
          >
            {story.description}
          </Text>
        ) : null}
        <Text {...autoDirection} numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}
