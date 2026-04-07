import type { SamaThemeTokens } from './tokens';

declare module '@mui/material/styles' {
  interface Theme {
    sama: SamaThemeTokens;
  }

  interface ThemeOptions {
    sama?: Partial<SamaThemeTokens>;
  }
}

export {};
