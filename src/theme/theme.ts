import { Dimensions, PixelRatio } from 'react-native';
import { Language } from '../types/language';
import { TextSize } from '../types/settings';
import { fontFamily } from '../platform/fonts/fonts';

const DESIGN_WIDTH = 1920;
const SCREEN_WIDTH = Dimensions.get('window').width;

const LINE_HEIGHT_RATIO: Record<Language, number> = {
  en: 1.3,
  ar: 1.6,
};

export const colors = {
  background: '#10171d',
  surface: '#18222b',
  surfaceRaised: '#2a3743',
  text: '#e8eef3',
  textMuted: '#9fb0be',
  accent: '#4cc2e0',
  accentSoft: '#173542',
  focus: '#ffffff',
  textOnFocus: '#10171d',
  error: '#ff6b6b',
  overlay: 'rgba(0, 0, 0, 0.7)',
  transparent: 'transparent',
} as const;

export const TEXT_SCALE: Record<TextSize, number> = {
  small: 0.85,
  medium: 1,
  large: 1.15,
  extraLarge: 1.3,
};

export function createTheme(language: Language, textSize: TextSize) {
  const ratio = SCREEN_WIDTH / DESIGN_WIDTH;
  const scale = (designPx: number) =>
    PixelRatio.roundToNearestPixel(designPx * ratio);

  const isRTL = language === 'ar';

  const textScale = TEXT_SCALE[textSize];
  const fontScale = (designPx: number) => scale(designPx * textScale);

  const fontSize = {
    caption: fontScale(20),
    body: fontScale(24),
    reading: fontScale(30),
    title: fontScale(32),
    headline: fontScale(44),
  };

  const lineHeightOf = (size: number) =>
    PixelRatio.roundToNearestPixel(size * LINE_HEIGHT_RATIO[language]);

  return {
    colors,
    scale,
    language,
    textSize,
    isRTL,
    direction: isRTL ? ('rtl' as const) : ('ltr' as const),
    spacing: {
      xs: scale(4),
      sm: scale(8),
      md: scale(16),
      lg: scale(24),
      xl: scale(32),
      xxl: scale(48),
    },
    safeArea: {
      horizontal: scale(96),
      vertical: scale(54),
    },
    radius: {
      sm: scale(6),
      md: scale(10),
      lg: scale(16),
    },
    fontFamily,
    monoFontFamily: 'monospace',
    fontSize,
    lineHeight: {
      caption: lineHeightOf(fontSize.caption),
      body: lineHeightOf(fontSize.body),
      reading: lineHeightOf(fontSize.reading),
      title: lineHeightOf(fontSize.title),
      headline: lineHeightOf(fontSize.headline),
    },
    focus: {
      borderWidth: Math.max(2, scale(4)),
      scale: 1.08,
    },
  };
}

export type Theme = ReturnType<typeof createTheme>;
