import arabic400 from '@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff2';
import arabic700 from '@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-700-normal.woff2';

const ARABIC_FALLBACK = 'App Arabic Fallback';

const ARABIC_RANGE =
  'U+0600-06FF, U+0750-077F, U+0870-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200E';

const fontFace = (url: string, weight: number) => `
@font-face {
  font-family: '${ARABIC_FALLBACK}';
  src: url('${url}') format('woff2');
  font-weight: ${weight};
  font-style: normal;
  font-display: block;
  unicode-range: ${ARABIC_RANGE};
}`;

const style = document.createElement('style');
style.textContent = fontFace(arabic400, 400) + fontFace(arabic700, 700);
document.head.appendChild(style);

export const fontFamily = `'LG Smart UI', '${ARABIC_FALLBACK}', sans-serif`;
