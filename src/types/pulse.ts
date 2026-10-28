import { Animated } from 'react-native';

export interface Pulse {
  style: { opacity: Animated.Value } | undefined;
  props: object;
}
