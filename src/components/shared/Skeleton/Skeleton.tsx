import React from 'react';
import { Animated } from 'react-native';
import { usePulse } from '../../../platform/pulse/pulse';
import { SkeletonProps } from './Skeleton.types';

export function Skeleton({ style, children }: SkeletonProps) {
  const pulse = usePulse();

  return (
    <Animated.View
      {...pulse.props}
      importantForAccessibility="no-hide-descendants"
      style={[style, pulse.style]}
    >
      {children}
    </Animated.View>
  );
}
