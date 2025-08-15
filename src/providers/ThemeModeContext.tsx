'use client'
import { createContext } from 'react';

enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

const ThemeModeContext = createContext({
  mode: ThemeMode.Light,
  setMode: (value: ThemeMode) => {},
});

export { ThemeMode, ThemeModeContext };