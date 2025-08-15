'use client';

import { ConfigProvider, theme } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { ThemeMode, ThemeModeContext } from './ThemeModeContext';

export const LOCAL_STORAGE_KEY = 'themeMode';

const AntdConfigProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Light);
  
  // Sử dụng useMemo để đảm bảo value context không thay đổi không cần thiết
  const value = useMemo(
    () => ({
      mode,
      setMode,
    }),
    [mode]
  );

  useEffect(() => {
    // Đọc theme từ localStorage khi component được mount
    const storedTheme = (localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode) || ThemeMode.Light;
    setMode(storedTheme);
    // Áp dụng class cho thẻ <html> để CSS global hoạt động
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  useEffect(() => {
    // Cập nhật localStorage và thuộc tính data-theme khi mode thay đổi
    localStorage.setItem(LOCAL_STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Sử dụng useMemo để tạo theme config chỉ khi mode thay đổi
  const THEME_CONFIG = useMemo(() => {
    const isDarkMode = mode === ThemeMode.Dark;
    

    return {
      algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      // token: customToken, // Uncomment nếu bạn tùy chỉnh token
    };
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={THEME_CONFIG}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  );
};

type Props = {
  children: React.ReactNode;
};

export default AntdConfigProvider;