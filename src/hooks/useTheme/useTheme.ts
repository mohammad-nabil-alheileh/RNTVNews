import { useMemo } from 'react';
import { createTheme, Theme } from '../../theme/theme';
import { useSettings } from '../useSettings/useSettings';

export function useTheme(): Theme {
  const { language, textSize } = useSettings();
  return useMemo(() => createTheme(language, textSize), [language, textSize]);
}
