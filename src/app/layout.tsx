// src/app/layout.tsx
'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { useRef } from 'react';
import './globals.css';
import AntdConfigProvider from '../providers/AntdConfigProvider';
import ErrorBoundary from './ErrorBoundary';
import 'katex/dist/katex.min.css';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import { App as AntdApp } from 'antd';
import { NotificationProvider } from '../providers/NotificationProvider';

const RootLayout = ({ children }: React.PropsWithChildren) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AntdRegistry>
          <AntdConfigProvider getPopupContainer={() => modalContainerRef.current ?? document.body}>
            <AntdApp>
              <NotificationProvider>
                <ErrorBoundary>
                  <LayoutWrapper>
                    <div ref={modalContainerRef}>{children}</div>
                  </LayoutWrapper>
                </ErrorBoundary>
              </NotificationProvider>
            </AntdApp>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
