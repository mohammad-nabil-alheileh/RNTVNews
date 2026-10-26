import React from 'react';
import {View} from 'react-native';
import {FocusGroupProps} from '../../components/shared/FocusGroup/FocusGroup.types';

export function FocusGuide({children, remember, trap = [], style}: FocusGroupProps) {
  const dataProps: object = {
    dataSet: {
      focusGroup: 'true',
      focusRemember: remember ? 'true' : undefined,
      focusTrap: trap.length > 0 ? trap.join(' ') : undefined,
    },
  };

  return (
    <View {...dataProps} style={style}>
      {children}
    </View>
  );
}
