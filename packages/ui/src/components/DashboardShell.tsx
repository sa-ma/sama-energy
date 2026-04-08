'use client';

import Box from '@mui/material/Box';

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
  header?: React.ReactNode;
}>;

export function DashboardShell({ children, header }: DashboardShellProps) {
  return (
    <Box
      component="main"
      sx={(theme) => ({
        minHeight: '100vh',
        backgroundColor: theme.sama.surface.canvas,
        backgroundImage: `linear-gradient(180deg, ${theme.sama.surface.overlay} 0%, ${theme.sama.surface.canvas} 100%)`,
      })}
    >
      {header ? (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.sama.surface.raised,
            borderBottom: `1px solid ${theme.sama.border.strong}`,
          })}
        >
          <Box
            sx={{
              px: { xs: 2.5, sm: 4, lg: 5 },
              pt: { xs: 1.25, sm: 1.5, lg: 1.75 },
              pb: { xs: 1.25, sm: 0, lg: 0 },
            }}
          >
            {header}
          </Box>
        </Box>
      ) : null}

      <Box
        sx={{
          mx: 'auto',
          maxWidth: 1440,
          px: { xs: 2.5, sm: 4, lg: 5 },
          pt: { xs: 2, sm: 2.5, lg: 3 },
          pb: { xs: 3, sm: 4, lg: 5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
