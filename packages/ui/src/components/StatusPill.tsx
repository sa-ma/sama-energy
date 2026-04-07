'use client';

import Box from '@mui/material/Box';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';

type StatusPillProps = Readonly<{
  children: React.ReactNode;
  tone?: 'positive' | 'negative' | 'warning' | 'info';
  compact?: boolean;
  glow?: boolean;
  sx?: SxProps<Theme>;
}>;

export function StatusPill({
  children,
  tone = 'positive',
  compact = false,
  glow = false,
  sx,
}: StatusPillProps) {
  const baseSx = (theme: Theme) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: `${theme.sama.radius.sm}px`,
    px: compact ? 0.8 : 1.05,
    py: compact ? 0.34 : 0.42,
    color: theme.sama.status[tone].fg,
    backgroundColor: theme.sama.status[tone].surface,
    border: `1px solid ${theme.sama.status[tone].border}`,
    boxShadow: glow ? `0 0 18px ${alpha(theme.sama.status[tone].fg, 0.16)}` : 'none',
    fontSize: compact ? '0.72rem' : '0.82rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    lineHeight: 1,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  });
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Box component="span" sx={composedSx}>
      {children}
    </Box>
  );
}
