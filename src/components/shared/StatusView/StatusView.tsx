import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {useStyles, useTheme} from '../../../theme/theme';
import {FocusableButton} from '../FocusableButton/FocusableButton';
import {makeStyles} from './StatusView.styles';
import {StatusViewProps} from './StatusView.types';

export function StatusView({
  kind,
  title,
  message,
  actionLabel,
  onAction,
  hasTVPreferredFocus,
  style,
}: StatusViewProps) {
  const styles = useStyles(makeStyles);
  const {colors, scale} = useTheme();
  const isProblem = kind === 'error' || kind === 'offline';

  return (
    <View
      style={[styles.container, style]}
      accessibilityLiveRegion="polite">
      {kind === 'loading' && (
        <ActivityIndicator
          size={scale(64)}
          color={colors.accent}
          style={styles.indicator}
        />
      )}
      <Text
        style={[styles.title, isProblem && styles.titleError]}
        accessibilityRole="header">
        {title}
      </Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FocusableButton
        label={actionLabel}
        onPress={onAction}
        hasTVPreferredFocus={hasTVPreferredFocus}
        style={styles.action}
      />
    </View>
  );
}
