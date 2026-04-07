'use client';

import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
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
  const StatusIcon =
    tone === 'negative' ? ArrowDownwardRounded : ArrowUpwardRounded;
  const baseSx = (theme: Theme) => ({
    minWidth: 0,
    px: { xs: 2.5, sm: 3 },
    py: { xs: 2.5, sm: 3 },
    backgroundColor: theme.sama.surface.raised,
  });
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Box
      sx={composedSx}
    >
      <Stack spacing={1.1}>
        <Typography
          sx={(theme) => ({
            color: theme.sama.text.primary,
            fontSize: '0.98rem',
            fontWeight: 650,
          })}
        >
          {label}
        </Typography>

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

          {loading ? (
            <Skeleton height={32} variant="rounded" width={82} />
          ) : change ? (
            <Box
              sx={(theme) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.2,
                py: 0.6,
                borderRadius: `${theme.sama.radius.pill}px`,
                backgroundColor: theme.sama.status[tone].surface,
                border: `1px solid ${theme.sama.status[tone].border}`,
                color: theme.sama.status[tone].fg,
                fontSize: '0.9rem',
                fontWeight: 600,
              })}
            >
              <StatusIcon sx={{ fontSize: '0.95rem' }} />
              <Box component="span">{change}</Box>
            </Box>
          ) : null}
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
