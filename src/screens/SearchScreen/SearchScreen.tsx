import React from 'react';
import {StatusView} from '../../components/shared/StatusView/StatusView';
import {ScreenProps} from '../../types/navigation';

export function SearchScreen({navigation}: ScreenProps<'Search'>) {
  return (
    <StatusView
      kind="empty"
      title="Search"
      actionLabel="Back"
      onAction={() => navigation.goBack()}
      hasTVPreferredFocus
    />
  );
}
