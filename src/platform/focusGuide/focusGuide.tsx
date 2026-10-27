import React, { useEffect, useRef } from 'react';
import { FocusGuideMethods, TVFocusGuideView, View } from 'react-native';
import { FocusGroupProps } from '../../components/shared/FocusGroup/FocusGroup.types';

export function FocusGuide({
  children,
  remember,
  trap = [],
  entry,
  style,
}: FocusGroupProps) {
  const guideRef = useRef<View & FocusGuideMethods>(null);
  const entered = useRef(false);

  useEffect(() => {
    if (entry === undefined || (remember && entered.current)) {
      return;
    }
    guideRef.current?.setDestinations(entry ? [entry] : []);
  }, [entry, remember]);

  const onFocusCapture = () => {
    if (entry !== undefined && remember && !entered.current) {
      entered.current = true;
      guideRef.current?.setDestinations([]);
    }
  };

  return (
    <TVFocusGuideView
      ref={guideRef}
      autoFocus={remember}
      trapFocusLeft={trap.includes('left')}
      trapFocusRight={trap.includes('right')}
      trapFocusUp={trap.includes('up')}
      trapFocusDown={trap.includes('down')}
      onFocusCapture={onFocusCapture}
      style={style}
    >
      {children}
    </TVFocusGuideView>
  );
}
