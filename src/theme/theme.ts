import {useMemo} from 'react';
import {Dimensions, PixelRatio} from 'react-native';
import {useLanguage} from '../i18n/language';
import {Language} from '../types/language';
import {fontFamily} from '../platform/fonts/fonts';

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

export function createTheme(language: Language) {
  const ratio = SCREEN_WIDTH / DESIGN_WIDTH;
  const scale = (designPx: number) =>
    PixelRatio.roundToNearestPixel(designPx * ratio);

  const isRTL = language === 'ar';

  const fontSize = {
    caption: scale(20),
    body: scale(24),
    title: scale(32),
    headline: scale(44),
  };

  const lineHeightOf = (size: number) =>
    PixelRatio.roundToNearestPixel(size * LINE_HEIGHT_RATIO[language]);

  return {
    colors,
    scale,
    language,
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
    fontSize,
    lineHeight: {
      caption: lineHeightOf(fontSize.caption),
      body: lineHeightOf(fontSize.body),
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

export function useTheme(): Theme {
  const language = useLanguage();
  return useMemo(() => createTheme(language), [language]);
}

export function useStyles<T>(makeStyles: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => makeStyles(theme), [makeStyles, theme]);
}
