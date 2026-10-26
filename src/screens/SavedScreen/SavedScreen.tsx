import React from 'react';
import {StatusView} from '../../components/shared/StatusView/StatusView';
import {ScreenProps} from '../../types/navigation';

export function SavedScreen({navigation}: ScreenProps<'Saved'>) {
  return (
    <StatusView
      kind="empty"
      title="Saved"
      actionLabel="Back"
      onAction={() => navigation.goBack()}
      hasTVPreferredFocus
    />
  );
}
