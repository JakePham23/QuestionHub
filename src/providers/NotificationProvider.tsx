// src/providers/NotificationProvider.tsx
'use client';

import { App } from 'antd';
import React, { createContext, useContext } from 'react';

type NotifyContextType = {
  notification: ReturnType<typeof App.useApp>['notification'];
  message: ReturnType<typeof App.useApp>['message'];
  modal: ReturnType<typeof App.useApp>['modal'];
};

const NotifyContext = createContext<NotifyContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { notification, message, modal } = App.useApp();

  return (
    <NotifyContext.Provider value={{ notification, message, modal }}>
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
};
