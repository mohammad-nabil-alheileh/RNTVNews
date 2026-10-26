import React from 'react';
import {StatusView} from '../../components/shared/StatusView/StatusView';
import {ScreenProps} from '../../types/navigation';

export function CategoryScreen({navigation}: ScreenProps<'Category'>) {
  return (
    <StatusView
      kind="empty"
      title="Category"
      actionLabel="Back"
      onAction={() => navigation.goBack()}
      hasTVPreferredFocus
    />
  );
}
