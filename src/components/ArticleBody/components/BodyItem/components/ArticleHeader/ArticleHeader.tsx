import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { sizedImageUrl } from '../../../../../../utils/sizedImageUrl/sizedImageUrl';
import { autoDirection } from '../../../../../../platform/textDirection/textDirection';
import { useStyles } from '../../../../../../hooks/useStyles/useStyles';
import { COVER_RATIO, makeStyles } from './ArticleHeader.styles';
import { ArticleHeaderProps } from './ArticleHeader.types';
import { useTranslation } from '../../../../../../hooks/useTranslation/useTranslation';

export function ArticleHeader({ story, date, width }: ArticleHeaderProps) {
  const t = useTranslation();
  const styles = useStyles(makeStyles);
  const [imageFailed, setImageFailed] = useState(false);
  const coverHeight = Math.round(width / COVER_RATIO);

  return (
    <View>
      <Text {...autoDirection} style={styles.title}>
        {story.title}
      </Text>
      <Text {...autoDirection} style={styles.meta}>
        {`${story.author} · ${date} · ${t('minRead', {
          minutes: story.readingMinutes,
        })}`}
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
