import './augment';

import { alpha, createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';

import { samaTokens } from './tokens';

export function createSamaTheme(options: ThemeOptions = {}) {
  const baseTheme = createTheme({
    cssVariables: true,
    shape: {
      borderRadius: 4,
    },
    palette: {
      mode: 'light',
      primary: {
        main: samaTokens.accent.primary,
        light: samaTokens.accent.strong,
      },
      success: {
        main: samaTokens.status.positive.fg,
      },
      warning: {
        main: samaTokens.status.warning.fg,
      },
      error: {
        main: samaTokens.status.negative.fg,
      },
      text: {
        primary: samaTokens.text.primary,
        secondary: samaTokens.text.muted,
      },
      background: {
        default: samaTokens.surface.canvas,
        paper: samaTokens.surface.raised,
      },
      divider: samaTokens.border.strong,
    },
    typography: {
      fontFamily: 'var(--font-open-sans)',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontSize: '1.22rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      overline: {
        fontWeight: 700,
        letterSpacing: '0.14em',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    sama: samaTokens,
  });

  return createTheme(baseTheme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            minHeight: '100%',
            backgroundColor: samaTokens.surface.canvas,
          },
          body: {
            minHeight: '100%',
            margin: 0,
            backgroundColor: samaTokens.surface.canvas,
          },
          '::selection': {
            backgroundColor: alpha(samaTokens.accent.primary, 0.18),
          },
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: theme.sama.radius.lg,
            backgroundColor: theme.sama.surface.raised,
            boxShadow: 'none',
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: theme.sama.radius.md,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }),
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            padding: theme.spacing(0.25),
            gap: theme.spacing(0.35),
            borderRadius: theme.sama.radius.md,
            border: `1px solid ${theme.sama.border.strong}`,
            backgroundColor: theme.sama.surface.raised,
            boxShadow: theme.sama.elevation.subtle,
          }),
          grouped: ({ theme }: { theme: Theme }) => ({
            border: 0,
            borderRadius: `${theme.sama.radius.sm}px !important`,
            minHeight: 36,
            paddingInline: theme.spacing(1.5),
            paddingBlock: theme.spacing(0.65),
            color: theme.sama.text.secondary,
            fontWeight: 600,
            lineHeight: 1.2,
            '&.Mui-selected': {
              backgroundColor: theme.sama.accent.muted,
              color: theme.palette.primary.main,
            },
            '&.Mui-selected:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.18),
            },
            '&:hover': {
              backgroundColor: theme.sama.accent.subtle,
            },
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            minHeight: 42,
            borderRadius: theme.sama.radius.md,
            backgroundColor: theme.sama.surface.raised,
            boxShadow: theme.sama.elevation.subtle,
            '& legend': {
              display: 'none',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              top: 0,
              borderColor: theme.sama.border.strong,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.sama.accent.border,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 4px ${theme.sama.accent.subtle}`,
            },
          }),
          input: ({ theme }: { theme: Theme }) => ({
            fontSize: '0.9rem',
            fontWeight: 600,
            color: theme.sama.text.primary,
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }: { theme: Theme }) => ({
            marginTop: theme.spacing(1),
            borderRadius: theme.sama.radius.lg,
            border: `1px solid ${theme.sama.border.strong}`,
            boxShadow: theme.sama.elevation.floating,
            backgroundColor: theme.sama.surface.overlay,
          }),
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: theme.sama.radius.md,
          }),
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: theme.sama.radius.md,
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme }: { theme: Theme }) => ({
            color: theme.sama.text.secondary,
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            borderBottomColor: theme.sama.border.strong,
          }),
          body: ({ theme }: { theme: Theme }) => ({
            borderBottomColor: theme.sama.border.subtle,
          }),
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            color: theme.sama.text.muted,
            '&.Mui-checked': {
              color: theme.palette.primary.main,
            },
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            '&:focus-visible': {
              outline: `2px solid ${theme.sama.accent.focusRing}`,
              outlineOffset: 2,
            },
          }),
        },
      },
      MuiTypography: {
        styleOverrides: {
          gutterBottom: {
            marginBottom: 0,
          },
        },
      },
    },
    ...options,
  });
}
