import React from 'react';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { ScreenProps } from '../../types/navigation';

export function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  return (
    <MainLayout current="Settings">
      <StatusView
        kind="empty"
        title="Settings"
        message="Coming soon"
        actionLabel="Back"
        onAction={() => navigation.goBack()}
        hasTVPreferredFocus
      />
    </MainLayout>
  );
}
