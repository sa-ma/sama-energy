'use client';

import { useEffect, useId, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const mobileGutter = 20;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePath]);

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
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

        <IconButton
          aria-controls={mobileMenuId}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen((open) => !open)}
          sx={(theme) => ({
            display: { xs: 'inline-flex', sm: 'none' },
            color: theme.sama.text.primary,
            border: `1px solid ${theme.sama.border.strong}`,
            backgroundColor: theme.sama.surface.subtle,
            borderRadius: `${theme.sama.radius.pill}px`,
            '&:hover': {
              backgroundColor: theme.sama.surface.overlay,
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.sama.text.primary}`,
              outlineOffset: 2,
            },
          })}
        >
          {mobileMenuOpen ? <CloseRounded fontSize="small" /> : <MenuRounded fontSize="small" />}
        </IconButton>
      </Box>

      <Stack
        id={mobileMenuId}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={0.75}
        sx={(theme) => ({
          display: { xs: mobileMenuOpen ? 'flex' : 'none', sm: 'flex' },
          alignSelf: { xs: 'stretch', sm: 'auto' },
          ml: { xs: `calc(-${mobileGutter}px - env(safe-area-inset-left))`, sm: 0 },
          mr: { xs: `calc(-${mobileGutter}px - env(safe-area-inset-right))`, sm: 0 },
          pl: { xs: `calc(${mobileGutter}px + env(safe-area-inset-left))`, sm: 0.35 },
          pr: { xs: `calc(${mobileGutter}px + env(safe-area-inset-right))`, sm: 0.35 },
          pt: { xs: 0.75, sm: 0.35 },
          pb: { xs: 0, sm: 0.35 },
          borderRadius: { xs: 0, sm: `${theme.sama.radius.pill}px` },
          borderTop: `1px solid ${theme.sama.border.strong}`,
          borderRight: { xs: 'none', sm: `1px solid ${theme.sama.border.strong}` },
          borderBottom: { xs: 'none', sm: `1px solid ${theme.sama.border.strong}` },
          borderLeft: { xs: 'none', sm: `1px solid ${theme.sama.border.strong}` },
          backgroundColor: theme.sama.surface.subtle,
          overflow: 'hidden',
        })}
      >
        {links.map((link) => {
          const isActive = activePath === link.href;

          return (
            <Box
              key={link.href}
              component={linkComponent}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              sx={(theme) => ({
                flex: { xs: 1, sm: '0 0 auto' },
                borderRadius: { xs: 0, sm: `${theme.sama.radius.pill}px` },
                px: 1.2,
                py: 0.62,
                textAlign: 'center',
                color: isActive ? theme.sama.text.primary : theme.sama.text.muted,
                backgroundColor: isActive ? theme.sama.surface.raised : 'transparent',
                border: '1px solid transparent',
                boxShadow: {
                  xs: 'none',
                  sm: isActive ? '0 1px 2px rgba(15, 23, 42, 0.06)' : 'none',
                },
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
                '&:focus-visible': {
                  outline: `2px solid ${theme.sama.text.primary}`,
                  outlineOffset: -2,
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
