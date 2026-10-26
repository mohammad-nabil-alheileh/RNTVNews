import React, { Component, ErrorInfo } from 'react';
import { StatusView } from '../StatusView/StatusView';
import { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  private retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <StatusView
        kind="error"
        title={this.props.title ?? 'Something went wrong'}
        actionLabel={this.props.actionLabel ?? 'Try again'}
        onAction={this.retry}
        hasTVPreferredFocus
      />
    );
  }
}
