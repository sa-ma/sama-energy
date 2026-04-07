'use client';

import TrendingDownRounded from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

type MetricTileProps = Readonly<{
  label: string;
  value?: string;
  caption: string;
  change?: string;
  loading?: boolean;
  tone?: 'positive' | 'negative';
  sx?: SxProps<Theme>;
}>;

export function MetricTile({
  label,
  value,
  caption,
  change,
  loading = false,
  tone = 'positive',
  sx,
}: MetricTileProps) {
  const StatusIcon = tone === 'negative' ? TrendingDownRounded : TrendingUpRounded;
  const baseSx = (theme: Theme) => ({
    minWidth: 0,
    height: '100%',
    px: { xs: 2.5, sm: 3 },
    py: { xs: 2.5, sm: 3 },
    backgroundColor: theme.sama.surface.raised,
    borderRadius: `${theme.sama.radius.lg}px`,
    border: `1px solid ${theme.sama.border.strong}`,
    boxShadow: theme.sama.elevation.floating,
  });
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Box
      sx={composedSx}
    >
      <Stack spacing={1.1}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.25,
            minWidth: 0,
          }}
        >
          {loading ? (
            <Skeleton height={26} variant="text" width="38%" />
          ) : (
            <Typography
              sx={(theme) => ({
                color: theme.sama.text.primary,
                fontSize: '0.98rem',
                fontWeight: 650,
              })}
            >
              {label}
            </Typography>
          )}

          {loading ? (
            <Skeleton height={32} variant="rounded" width={82} />
          ) : change ? (
            <Box
              sx={(theme) => ({
                display: 'inline-flex',
                flexShrink: 0,
                alignItems: 'center',
                gap: 0.45,
                px: 1,
                py: 0.42,
                borderRadius: `${theme.sama.radius.pill}px`,
                backgroundColor: theme.sama.status[tone].surface,
                border: `1px solid ${theme.sama.status[tone].border}`,
                color: theme.sama.status[tone].fg,
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              })}
            >
              <StatusIcon sx={{ fontSize: '0.92rem' }} />
              <Box component="span">{change}</Box>
            </Box>
          ) : (
            <Box />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.25,
            flexWrap: 'wrap',
          }}
        >
          {loading ? (
            <Skeleton height={44} variant="text" width="44%" />
          ) : (
            <Typography
              component="div"
              sx={(theme) => ({
                fontSize: { xs: '2.05rem', sm: '2.2rem' },
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1.05,
                color: theme.sama.text.primary,
              })}
            >
              {value}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={(theme) => ({
            color: theme.sama.text.secondary,
            fontSize: '0.92rem',
          })}
        >
          {caption}
        </Typography>
      </Stack>
    </Box>
  );
}
