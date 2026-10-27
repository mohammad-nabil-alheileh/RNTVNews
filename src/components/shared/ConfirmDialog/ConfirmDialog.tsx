import React, { useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import { onBack } from '../../../platform/back/back';
import { layoutDirectionProps } from '../../../platform/layoutDirection/layoutDirection';
import { autoDirection } from '../../../platform/textDirection/textDirection';
import { useStyles } from '../../../hooks/useStyles/useStyles';
import { FocusableButton } from '../FocusableButton/FocusableButton';
import { makeStyles } from './ConfirmDialog.styles';
import { ConfirmDialogProps } from './ConfirmDialog.types';

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const styles = useStyles(makeStyles);
  const { direction } = useTheme();
  const directionProps = layoutDirectionProps(direction);

  useEffect(() => {
    if (!visible) {
      return;
    }
    return onBack(() => {
      onCancel();
      return true;
    });
  }, [visible, onCancel]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <View {...directionProps} style={[styles.backdrop, directionProps.style]}>
        <View style={styles.box} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {message ? (
            <Text {...autoDirection} style={styles.message}>
              {message}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <FocusableButton
              label={cancelLabel}
              onPress={onCancel}
              hasTVPreferredFocus
            />
            <FocusableButton label={confirmLabel} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
