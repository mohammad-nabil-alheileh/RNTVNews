import { useMemo } from 'react';
import { Theme } from '../../theme/theme';
import { useTheme } from '../useTheme/useTheme';

export function useStyles<T>(makeStyles: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => makeStyles(theme), [makeStyles, theme]);
}
