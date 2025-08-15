'use client';
import React from 'react';
import { Result, Button } from 'antd';

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<object>> {
  state = { hasError: false, error: null as Error | null };
  isDev = process.env.NODE_ENV === 'development';

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.isDev) {
        return (
          <Result
            status="500"
            title="Component Error (Dev Mode)"
            subTitle={
              <>
                <p>{this.state.error?.message}</p>
                <pre
                  style={{
                    textAlign: 'left',
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    overflowX: 'auto',
                  }}
                >
                  {this.state.error?.stack}
                </pre>
              </>
            }
            extra={<Button onClick={() => window.location.reload()}>Reload</Button>}
          />
        );
      }
      return (
        <Result
          status="500"
          title="Something went wrong"
          subTitle="Please try again later."
          extra={<Button onClick={() => window.location.reload()}>Reload</Button>}
        />
      );
    }
    return this.props.children;
  }
}
