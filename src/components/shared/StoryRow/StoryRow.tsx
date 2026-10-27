import React, { memo, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { sizedImageUrl } from '../../../utils/sizedImageUrl/sizedImageUrl';
import { formatShortDate } from '../../../utils/formatShortDate/formatShortDate';
import { useLanguage } from '../../../hooks/useLanguage/useLanguage';
import { preferredFocusProps } from '../../../platform/preferredFocus/preferredFocus';
import { autoDirection } from '../../../platform/textDirection/textDirection';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import { makeStyles, thumbSize, TITLE_LINES } from './StoryRow.styles';
import { StoryRowProps } from './StoryRow.types';
import { useTranslation } from '../../../hooks/useTranslation/useTranslation';

function StoryRowView({
  story,
  onPress,
  onFocus,
  hasTVPreferredFocus,
  style,
}: StoryRowProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const language = useLanguage();
  const [focused, setFocused] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const thumb = thumbSize(theme);

  const date = useMemo(
    () => formatShortDate(story.publishedAt, language),
    [story.publishedAt, language],
  );
  const meta = `${story.author} · ${date} · ${t('minRead', {
    minutes: story.readingMinutes,
  })}`;

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
      accessibilityLabel={`${story.title}, ${meta}`}
      style={[styles.row, focused && styles.focused, style]}
    >
      <View style={[styles.thumb, thumb]}>
        {story.imageUrl !== null && !imageFailed && (
          <Image
            source={{
              uri: sizedImageUrl(story.imageUrl, thumb.width, thumb.height),
            }}
            resizeMode="cover"
            resizeMethod="resize"
            fadeDuration={0}
            onError={() => setImageFailed(true)}
            style={thumb}
          />
        )}
      </View>
      <View style={styles.text}>
        <Text
          {...autoDirection}
          numberOfLines={TITLE_LINES}
          style={styles.title}
        >
          {story.title}
        </Text>
        <Text {...autoDirection} numberOfLines={1} style={styles.meta}>
          {meta}
        </Text>
      </View>
    </Pressable>
  );
}

export const StoryRow = memo(StoryRowView);
