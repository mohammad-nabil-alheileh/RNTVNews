import {ReactNode} from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  actionLabel?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}
