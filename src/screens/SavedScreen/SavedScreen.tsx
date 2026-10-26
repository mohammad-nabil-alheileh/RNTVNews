import React from 'react';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { ScreenProps } from '../../types/navigation';

export function SavedScreen({ navigation }: ScreenProps<'Saved'>) {
  return (
    <MainLayout current="Saved">
      <StatusView
        kind="empty"
        title="Saved"
        message="Coming soon"
        actionLabel="Back"
        onAction={() => navigation.goBack()}
        hasTVPreferredFocus
      />
    </MainLayout>
  );
}
