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

export const metadata = {
  title: 'Question Hub Education',
  description: 'Ngân hàng đề thi trắc nghiệm Toán - Vật Lý - Hóa khổng lồ, bám sát chương trình học cho mọi cấp lớp với công nghệ AI tiên tiến.',
  openGraph: {
    title: 'Question Hub Education',
    description: 'Ngân hàng đề thi trắc nghiệm Toán - Vật Lý - Hóa khổng lồ, bám sát chương trình học cho mọi cấp lớp với công nghệ AI tiên tiến.',
    images: [
      {
        url: 'https://www.questionhub.edu.vn/public/preview.png', // URL tuyệt đối
        alt: 'Question Hub Education',
      },
    ],
  },
};
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
