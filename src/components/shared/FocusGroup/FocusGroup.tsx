import React from 'react';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import { FocusGuide } from '../../../platform/focusGuide/focusGuide';
import { FocusDirection } from '../../../types/focus';
import { FocusGroupProps } from './FocusGroup.types';

const MIRRORED: Record<FocusDirection, FocusDirection> = {
  left: 'right',
  right: 'left',
  up: 'up',
  down: 'down',
};

export function FocusGroup({ trap = [], ...props }: FocusGroupProps) {
  const { isRTL } = useTheme();
  const sides = isRTL ? trap.map(direction => MIRRORED[direction]) : trap;
  return <FocusGuide {...props} trap={sides} />;
}
