import React from 'react';
import { CellRendererProps, View, ViewProps } from 'react-native';
import { SectionLayout } from '../../types/layout';

export function createMeasuredCell<T>(cells: Map<number, SectionLayout>) {
  return function MeasuredCell({
    index,
    style,
    children,
    onLayout,
    onFocusCapture,
  }: CellRendererProps<T>) {
    return (
      <View
        style={style}
        onFocusCapture={onFocusCapture as ViewProps['onFocusCapture']}
        onLayout={event => {
          const { y, height } = event.nativeEvent.layout;
          cells.set(index, { y, height });
          onLayout?.(event);
        }}
      >
        {children}
      </View>
    );
  };
}
