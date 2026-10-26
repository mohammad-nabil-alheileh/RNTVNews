import { PixelRatio } from 'react-native';

const DYNAMIC_IMAGE =
  /^(https:\/\/media\d*\.dev\.to\/dynamic\/image\/)[^/]+\/(.+)$/;

export function sizedImageUrl(
  url: string,
  width: number,
  height?: number,
): string {
  const match = url.match(DYNAMIC_IMAGE);
  if (!match) {
    return url;
  }
  const pixelWidth = PixelRatio.getPixelSizeForLayoutSize(width);
  const options =
    height === undefined
      ? `width=${pixelWidth},height=,fit=scale-down`
      : `width=${pixelWidth},height=${PixelRatio.getPixelSizeForLayoutSize(
          height,
        )},fit=cover`;
  return `${match[1]}${options},gravity=auto,format=auto/${match[2]}`;
}
