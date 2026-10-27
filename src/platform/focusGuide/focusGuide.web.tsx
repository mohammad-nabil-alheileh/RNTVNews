import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { FocusGroupProps } from '../../components/shared/FocusGroup/FocusGroup.types';

const ENTRY_ATTRIBUTE = 'data-focus-entry';
let nextGroupId = 1;
const newGroupId = () => String(nextGroupId++);

export function FocusGuide({
  children,
  remember,
  trap = [],
  entry,
  style,
}: FocusGroupProps) {
  const [groupId] = useState(newGroupId);
  const marked = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = (entry as unknown as HTMLElement | null) ?? null;
    if (element === marked.current) {
      return;
    }
    marked.current?.removeAttribute(ENTRY_ATTRIBUTE);
    element?.setAttribute(ENTRY_ATTRIBUTE, groupId);
    marked.current = element;
  }, [entry, groupId]);

  const dataProps: object = {
    dataSet: {
      focusGroup: groupId,
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
