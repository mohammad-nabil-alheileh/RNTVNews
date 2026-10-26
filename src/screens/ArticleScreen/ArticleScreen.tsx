import React from 'react';
import {StatusView} from '../../components/shared/StatusView/StatusView';
import {ScreenProps} from '../../types/navigation';

export function ArticleScreen({navigation}: ScreenProps<'Article'>) {
  return (
    <StatusView
      kind="empty"
      title="Article"
      actionLabel="Back"
      onAction={() => navigation.goBack()}
      hasTVPreferredFocus
    />
  );
}
