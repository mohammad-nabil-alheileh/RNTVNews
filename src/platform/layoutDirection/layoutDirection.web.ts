import { ViewProps } from 'react-native';

export function layoutDirectionProps(direction: 'ltr' | 'rtl'): ViewProps {
  return { dir: direction } as ViewProps;
}
