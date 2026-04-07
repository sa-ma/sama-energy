'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, type ThemeOptions } from '@mui/material/styles';

import { createSamaTheme } from './create-sama-theme';

type SamaThemeProviderProps = Readonly<{
  children: React.ReactNode;
  themeOptions?: ThemeOptions;
}>;

export function SamaThemeProvider({
  children,
  themeOptions,
}: SamaThemeProviderProps) {
  const theme = createSamaTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
