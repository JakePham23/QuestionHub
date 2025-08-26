// src/app/RootClientLayout.tsx
'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { useRef } from 'react';
import AntdConfigProvider from '../providers/AntdConfigProvider';
import ErrorBoundary from './ErrorBoundary';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import { App as AntdApp } from 'antd';
import { NotificationProvider } from '../providers/NotificationProvider';

const RootClientLayout = ({ children }: React.PropsWithChildren) => {
  const modalContainerRef = useRef<HTMLDivElement>(null);

  return (
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
  );
};

export default RootClientLayout;