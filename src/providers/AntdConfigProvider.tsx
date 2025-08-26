'use client';

import { ConfigProvider, theme } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { ThemeMode, ThemeModeContext } from './ThemeModeContext';

export const LOCAL_STORAGE_KEY = 'themeMode';

type Props = {
  children: React.ReactNode;
  getPopupContainer?: () => HTMLElement; // 👈 thêm dòng này
};

const AntdConfigProvider = ({ children, getPopupContainer }: Props) => {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Light);

  const value = useMemo(
    () => ({
      mode,
      setMode,
    }),
    [mode]
  );

  useEffect(() => {
    const storedTheme = (localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode) || ThemeMode.Light;
    setMode(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const THEME_CONFIG = useMemo(() => {
    const isDarkMode = mode === ThemeMode.Dark;

    return {
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={THEME_CONFIG} getPopupContainer={getPopupContainer}>
        {children}
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
};

export default AntdConfigProvider;
