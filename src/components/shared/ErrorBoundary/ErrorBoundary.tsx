import React, { Component, ErrorInfo } from 'react';
import { getSettings } from '../../../api/settingsStore';
import { translate } from '../../../utils/translate/translate';
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
    const { language } = getSettings();
    return (
      <StatusView
        kind="error"
        title={this.props.title ?? translate(language, 'somethingWentWrong')}
        actionLabel={this.props.actionLabel ?? translate(language, 'tryAgain')}
        onAction={this.retry}
        hasTVPreferredFocus
      />
    );
  }
}
