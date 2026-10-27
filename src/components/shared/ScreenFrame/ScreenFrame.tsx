import React from 'react';
import { View } from 'react-native';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import { layoutDirectionProps } from '../../../platform/layoutDirection/layoutDirection';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { makeStyles } from './ScreenFrame.styles';
import { ScreenFrameProps } from './ScreenFrame.types';

export function ScreenFrame({ children }: ScreenFrameProps) {
  const styles = useStyles(makeStyles);
  const { direction } = useTheme();
  const directionProps = layoutDirectionProps(direction);

  return (
    <View {...directionProps} style={[styles.screen, directionProps.style]}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </View>
  );
}
