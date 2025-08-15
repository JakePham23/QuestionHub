// src/components/layout/LayoutWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import React from 'react';

const LayoutWrapper = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const isExamPage = pathname.startsWith('/exam');

  return (
    <>
      {!isExamPage && <AppHeader />}
      {children}
      {!isExamPage && <AppFooter />}
    </>
  );
};

export default LayoutWrapper;