'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type DashboardNavLink = {
  href: string;
  label: string;
};

type DashboardNavProps = Readonly<{
  activePath: string;
  brand?: string;
  links: readonly DashboardNavLink[];
  linkComponent?: React.ElementType;
}>;

export function DashboardNav({
  activePath,
  brand = 'SAMA ENERGY',
  links,
  linkComponent = 'a',
}: DashboardNavProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 1.25,
        minHeight: 40,
      }}
    >
      <Typography
        component="div"
        sx={(theme) => ({
          color: theme.sama.text.primary,
          fontSize: '0.9rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          lineHeight: 1,
        })}
      >
        {brand}
      </Typography>

      <Stack
        direction="row"
        spacing={0.75}
        sx={(theme) => ({
          alignSelf: { xs: 'stretch', sm: 'auto' },
          borderRadius: `${theme.sama.radius.pill}px`,
          border: `1px solid ${theme.sama.border.strong}`,
          backgroundColor: theme.sama.surface.subtle,
          p: 0.35,
          overflowX: 'auto',
        })}
      >
        {links.map((link) => {
          const isActive = activePath === link.href;

          return (
            <Box
              key={link.href}
              component={linkComponent}
              href={link.href}
              sx={(theme) => ({
                flex: { xs: 1, sm: '0 0 auto' },
                borderRadius: `${theme.sama.radius.pill}px`,
                px: 1.2,
                py: 0.62,
                textAlign: 'center',
                color: isActive ? theme.sama.text.primary : theme.sama.text.muted,
                backgroundColor: isActive ? theme.sama.surface.raised : 'transparent',
                border: '1px solid transparent',
                boxShadow: isActive ? '0 1px 2px rgba(15, 23, 42, 0.06)' : 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                lineHeight: 1,
                transition:
                  'background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease, color 160ms ease',
                '&:hover': {
                  color: theme.sama.text.primary,
                  backgroundColor: isActive
                    ? theme.sama.surface.overlay
                    : 'rgba(255, 255, 255, 0.6)',
                },
              })}
            >
              {link.label}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
