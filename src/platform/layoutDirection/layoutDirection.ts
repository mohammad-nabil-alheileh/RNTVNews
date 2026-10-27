import { ViewProps } from 'react-native';

export function layoutDirectionProps(direction: 'ltr' | 'rtl'): ViewProps {
  return { style: { direction } };
}
