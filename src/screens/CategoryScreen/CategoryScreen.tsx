import React from 'react';
import { MainLayout } from '../../components/shared/MainLayout/MainLayout';
import { StatusView } from '../../components/shared/StatusView/StatusView';
import { ScreenProps } from '../../types/navigation';

export function CategoryScreen({ navigation }: ScreenProps<'Category'>) {
  return (
    <MainLayout current="Category">
      <StatusView
        kind="empty"
        title="Category"
        message="Coming soon"
        actionLabel="Back"
        onAction={() => navigation.goBack()}
        hasTVPreferredFocus
      />
    </MainLayout>
  );
}
