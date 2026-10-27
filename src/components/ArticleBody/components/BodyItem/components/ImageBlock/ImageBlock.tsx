import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { sizedImageUrl } from '../../../../../../utils/sizedImageUrl/sizedImageUrl';
import { useStyles } from '../../../../../../hooks/useStyles/useStyles';
import { useTheme } from '../../../../../../hooks/useTheme/useTheme';
import {
  FALLBACK_RATIO,
  makeStyles,
  MAX_IMAGE_HEIGHT,
} from './ImageBlock.styles';
import { ImageBlockProps } from './ImageBlock.types';
import { useImageFailure } from '../../../../../../hooks/useImageFailure/useImageFailure';

function ImageBlockView({ block, width }: ImageBlockProps) {
  const styles = useStyles(makeStyles);
  const theme = useTheme();
  const [failed, markImageFailed] = useImageFailure();

  const ratio = block.aspectRatio ?? FALLBACK_RATIO;
  const height = Math.round(
    Math.min(width / ratio, theme.scale(MAX_IMAGE_HEIGHT)),
  );
  const imageWidth = block.aspectRatio
    ? Math.round(Math.min(width, height * ratio))
    : width;

  return (
    <View style={[styles.box, { width, height }]}>
      {!failed && (
        <Image
          source={{ uri: sizedImageUrl(block.url, imageWidth) }}
          resizeMode="contain"
          resizeMethod="resize"
          fadeDuration={0}
          onError={markImageFailed}
          style={{ width: imageWidth, height }}
        />
      )}
    </View>
  );
}

export const ImageBlock = memo(ImageBlockView);
