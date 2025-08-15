// src/app/layout.tsx
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from 'react';
import './globals.css';
import AntdConfigProvider from '../providers/AntdConfigProvider';
import ErrorBoundary from './ErrorBoundary';
import 'katex/dist/katex.min.css';
import LayoutWrapper from '../components/layout/LayoutWrapper';

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-qb-installed="true">
    <body>
      <AntdRegistry>
        <AntdConfigProvider>
          <ErrorBoundary>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ErrorBoundary>
        </AntdConfigProvider>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;