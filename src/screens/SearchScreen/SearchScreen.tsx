import React from 'react';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { ScreenProps } from '../../types/navigation';

export function SearchScreen({ navigation }: ScreenProps<'Search'>) {
  return (
    <MainLayout current="Search">
      <StatusView
        kind="empty"
        title="Search"
        message="Coming soon"
        actionLabel="Back"
        onAction={() => navigation.goBack()}
        hasTVPreferredFocus
      />
    </MainLayout>
  );
}
