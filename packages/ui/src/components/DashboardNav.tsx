'use client';

import { useEffect, useId, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

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
        flexDirection: 'column',
        gap: 1.25,
        minHeight: 40,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          minHeight: { xs: 40, sm: 56 },
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography
          component="div"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            minHeight: { sm: 56 },
            color: theme.sama.text.primary,
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
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
            color: theme.palette.primary.main,
            border: `1px solid ${theme.sama.accent.border}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: `${theme.sama.radius.pill}px`,
            '&:hover': {
              backgroundColor: theme.sama.accent.subtle,
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.sama.accent.focusRing}`,
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
        spacing={{ xs: 0.35, sm: 4.5 }}
        sx={(theme) => ({
          display: { xs: mobileMenuOpen ? 'flex' : 'none', sm: 'flex' },
          position: { sm: 'absolute' },
          left: { sm: '50%' },
          top: { sm: 0 },
          bottom: { sm: 0 },
          transform: { sm: 'translateX(-50%)' },
          alignItems: { xs: 'stretch', sm: 'center' },
          ml: { xs: `calc(-${mobileGutter}px - env(safe-area-inset-left))`, sm: 0 },
          mr: { xs: `calc(-${mobileGutter}px - env(safe-area-inset-right))`, sm: 0 },
          pl: { xs: `calc(${mobileGutter}px + env(safe-area-inset-left))`, sm: 0 },
          pr: { xs: `calc(${mobileGutter}px + env(safe-area-inset-right))`, sm: 0 },
          pt: { xs: 1, sm: 0 },
          pb: { xs: 0.5, sm: 0 },
          mt: { xs: 0.1, sm: 0 },
          minWidth: 0,
          borderTop: { xs: `1px solid ${theme.sama.border.strong}`, sm: 'none' },
          backgroundColor: { xs: theme.sama.surface.raised, sm: 'transparent' },
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 1.2, sm: 0.2 },
                py: { xs: 0.95, sm: 0 },
                textAlign: { xs: 'left', sm: 'center' },
                color: isActive ? theme.sama.text.primary : theme.sama.text.secondary,
                backgroundColor: {
                  xs: isActive ? theme.sama.accent.subtle : 'transparent',
                  sm: 'transparent',
                },
                borderLeft: {
                  xs: `2px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
                  sm: 'none',
                },
                borderBottom: {
                  xs: 'none',
                  sm: `2px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
                },
                fontSize: '0.9rem',
                fontWeight: { xs: isActive ? 700 : 600, sm: isActive ? 650 : 500 },
                lineHeight: 1,
                minHeight: { sm: '100%' },
                transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
                '&:hover': {
                  color: theme.sama.text.primary,
                  borderBottomColor: theme.palette.primary.main,
                  backgroundColor: {
                    xs: isActive ? theme.sama.accent.subtle : alpha(theme.palette.primary.main, 0.04),
                    sm: 'transparent',
                  },
                },
                '&:focus-visible': {
                  outline: `2px solid ${theme.sama.accent.focusRing}`,
                  outlineOffset: 2,
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
