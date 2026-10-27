import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { preferredFocusProps } from '../../../platform/preferredFocus/preferredFocus';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { makeStyles } from './FocusableButton.styles';
import { FocusableButtonProps } from './FocusableButton.types';

export function FocusableButton({
  label,
  onPress,
  onFocus,
  onBlur,
  ref,
  hasTVPreferredFocus,
  selected = false,
  disabled = false,
  style,
}: FocusableButtonProps) {
  const styles = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      onFocus={() => {
        setFocused(true);
        onFocus?.();
      }}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      hasTVPreferredFocus={hasTVPreferredFocus}
      {...preferredFocusProps(hasTVPreferredFocus)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      style={[
        styles.button,
        selected && styles.selected,
        focused && styles.focused,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>
    </Pressable>
  );
}
