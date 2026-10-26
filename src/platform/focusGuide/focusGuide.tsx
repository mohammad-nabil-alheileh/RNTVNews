import React from 'react';
import { TVFocusGuideView } from 'react-native';
import { FocusGroupProps } from '../../components/shared/FocusGroup/FocusGroup.types';

export function FocusGuide({
  children,
  remember,
  trap = [],
  style,
}: FocusGroupProps) {
  return (
    <TVFocusGuideView
      autoFocus={remember}
      trapFocusLeft={trap.includes('left')}
      trapFocusRight={trap.includes('right')}
      trapFocusUp={trap.includes('up')}
      trapFocusDown={trap.includes('down')}
      style={style}
    >
      {children}
    </TVFocusGuideView>
  );
}
