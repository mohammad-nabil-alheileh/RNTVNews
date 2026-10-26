import React from 'react';
import {StatusView} from '../../components/shared/StatusView/StatusView';
import {ScreenProps} from '../../types/navigation';

export function SettingsScreen({navigation}: ScreenProps<'Settings'>) {
  return (
    <StatusView
      kind="empty"
      title="Settings"
      actionLabel="Back"
      onAction={() => navigation.goBack()}
      hasTVPreferredFocus
    />
  );
}
