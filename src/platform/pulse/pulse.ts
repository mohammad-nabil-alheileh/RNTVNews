import { useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { Pulse } from '../../types/pulse';

const opacity = new Animated.Value(1);
const pulse: Pulse = { style: { opacity }, props: {} };

let users = 0;
let loop: Animated.CompositeAnimation | null = null;

const step = (toValue: number) =>
  Animated.timing(opacity, {
    toValue,
    duration: 900,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  });

export function usePulse(): Pulse {
  useEffect(() => {
    users += 1;
    if (users === 1) {
      loop = Animated.loop(Animated.sequence([step(0.55), step(1)]));
      loop.start();
    }
    return () => {
      users -= 1;
      if (users === 0) {
        loop?.stop();
        loop = null;
        opacity.setValue(1);
      }
    };
  }, []);
  return pulse;
}
