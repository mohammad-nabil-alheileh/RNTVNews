import React, { useContext } from 'react';
import { CellRendererProps, View, ViewProps } from 'react-native';
import { MeasuredCellContext } from './MeasuredCell.context';

export function MeasuredCell({
  index,
  style,
  children,
  onLayout,
  onFocusCapture,
}: CellRendererProps<unknown>) {
  const recordCell = useContext(MeasuredCellContext);

  return (
    <View
      style={style}
      onFocusCapture={onFocusCapture as ViewProps['onFocusCapture']}
      onLayout={event => {
        const { y, height } = event.nativeEvent.layout;
        recordCell(index, { offset: y, size: height });
        onLayout?.(event);
      }}
    >
      {children}
    </View>
  );
}
