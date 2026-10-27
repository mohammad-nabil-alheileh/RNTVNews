import React from 'react';
import { ConfirmDialog } from '../shared/ConfirmDialog/ConfirmDialog';
import { ExitDialogProps } from './ExitDialog.types';
import { useTranslation } from '../../hooks/useTranslation/useTranslation';

export function ExitDialog({ visible, onStay, onExit }: ExitDialogProps) {
  const t = useTranslation();
  return (
    <ConfirmDialog
      visible={visible}
      title={t('exitTitle')}
      confirmLabel={t('exit')}
      cancelLabel={t('stay')}
      onConfirm={onExit}
      onCancel={onStay}
    />
  );
}
