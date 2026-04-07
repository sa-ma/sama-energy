'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const navLinks = [
  {
    href: '/dashboard/overview',
    label: 'Overview',
  },
  {
    href: '/dashboard/comparison',
    label: 'Comparison',
  },
] as const;

export default function DashboardHeader() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        minHeight: 32,
      }}
    >
      <Typography
        component="div"
        sx={{
          color: '#0f172a',
          fontSize: '0.95rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          lineHeight: 1,
        }}
      >
        SAMA ENERGY
      </Typography>

      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignSelf: { xs: 'stretch', sm: 'auto' },
          borderRadius: 2.5,
          border: '1px solid rgba(203, 213, 225, 0.78)',
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
          boxShadow: '0 6px 16px rgba(15, 23, 42, 0.05)',
          p: 0.45,
          overflowX: 'auto',
        }}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Box
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                borderRadius: 2,
                px: 1.45,
                py: 0.78,
                textAlign: 'center',
                color: isActive ? '#0f172a' : 'rgba(71, 85, 105, 0.82)',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.96)' : 'transparent',
                border: '1px solid',
                borderColor: isActive
                  ? 'rgba(203, 213, 225, 0.95)'
                  : 'rgba(203, 213, 225, 0.36)',
                boxShadow: isActive
                  ? '0 6px 14px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)'
                  : 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                lineHeight: 1,
                transition:
                  'background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease, color 160ms ease',
                '&:hover': {
                  color: '#0f172a',
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(255, 255, 255, 0.52)',
                  borderColor: isActive
                    ? 'rgba(203, 213, 225, 0.98)'
                    : 'rgba(203, 213, 225, 0.58)',
                },
              }}
            >
              {link.label}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
