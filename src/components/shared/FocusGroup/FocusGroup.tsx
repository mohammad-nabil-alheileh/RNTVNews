import React from 'react';
import {FocusGuide} from '../../../platform/focusGuide/focusGuide';
import {FocusGroupProps} from './FocusGroup.types';

export function FocusGroup(props: FocusGroupProps) {
  return <FocusGuide {...props} />;
}
