'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@/theme';

type AppThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
