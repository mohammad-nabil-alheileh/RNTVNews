import React, { useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import { onBack } from '../../platform/back/back';
import { useStyles } from '../../theme/theme';
import { FocusableButton } from '../shared/FocusableButton/FocusableButton';
import { makeStyles } from './ExitDialog.styles';
import { ExitDialogProps } from './ExitDialog.types';

export function ExitDialog({ visible, onStay, onExit }: ExitDialogProps) {
  const styles = useStyles(makeStyles);

  useEffect(() => {
    if (!visible) {
      return;
    }
    return onBack(() => {
      onStay();
      return true;
    });
  }, [visible, onStay]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onStay}
    >
      <View style={styles.backdrop}>
        <View style={styles.box} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">
            Exit TV News Reader?
          </Text>
          <View style={styles.actions}>
            <FocusableButton
              label="Stay"
              onPress={onStay}
              hasTVPreferredFocus
            />
            <FocusableButton label="Exit" onPress={onExit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
