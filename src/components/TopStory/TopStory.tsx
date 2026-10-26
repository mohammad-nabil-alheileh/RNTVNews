import React, {useMemo, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {formatShortDate} from '../../i18n/formatDate';
import {useLanguage} from '../../i18n/language';
import {autoDirection} from '../../platform/textDirection/textDirection';
import {useStyles} from '../../theme/theme';
import {DESCRIPTION_LINES, makeStyles, TITLE_LINES} from './TopStory.styles';
import {TopStoryProps} from './TopStory.types';

export function TopStory({
  story,
  onPress,
  onFocus,
  hasTVPreferredFocus,
}: TopStoryProps) {
  const styles = useStyles(makeStyles);
  const language = useLanguage();
  const [focused, setFocused] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

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
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Top story: ${story.title}, ${meta}`}
      style={[styles.container, focused && styles.focused]}>
      {showImage && (
        <Image
          source={{uri: story.imageUrl!}}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          style={styles.image}
        />
      )}
      <View style={styles.panel}>
        <Text style={styles.label}>Top story</Text>
        <Text
          {...autoDirection}
          numberOfLines={TITLE_LINES}
          style={styles.title}>
          {story.title}
        </Text>
        {story.description ? (
          <Text
            {...autoDirection}
            numberOfLines={DESCRIPTION_LINES}
            style={styles.description}>
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
