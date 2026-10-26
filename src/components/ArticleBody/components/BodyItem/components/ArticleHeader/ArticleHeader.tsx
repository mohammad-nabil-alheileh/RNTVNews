import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { sizedImageUrl } from '../../../../../../api/devtoImage';
import { autoDirection } from '../../../../../../platform/textDirection/textDirection';
import { useStyles } from '../../../../../../theme/theme';
import { COVER_RATIO, makeStyles } from './ArticleHeader.styles';
import { ArticleHeaderProps } from './ArticleHeader.types';

export function ArticleHeader({ story, date, width }: ArticleHeaderProps) {
  const styles = useStyles(makeStyles);
  const [imageFailed, setImageFailed] = useState(false);
  const coverHeight = Math.round(width / COVER_RATIO);

  return (
    <View>
      <Text {...autoDirection} style={styles.title}>
        {story.title}
      </Text>
      <Text {...autoDirection} style={styles.meta}>
        {`${story.author} · ${date} · ${story.readingMinutes} min read`}
      </Text>
      {story.imageUrl !== null && (
        <View style={[styles.cover, { width, height: coverHeight }]}>
          {!imageFailed && (
            <Image
              source={{
                uri: sizedImageUrl(story.imageUrl, width, coverHeight),
              }}
              resizeMode="cover"
              resizeMethod="resize"
              fadeDuration={0}
              onError={() => setImageFailed(true)}
              style={{ width, height: coverHeight }}
            />
          )}
        </View>
      )}
    </View>
  );
}
