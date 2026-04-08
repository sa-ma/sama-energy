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
    minHeight: { xs: 102, sm: 108 },
    px: { xs: 1.5, sm: 1.7 },
    py: { xs: 1.3, sm: 1.45 },
    backgroundColor: '#fcfcfc',
    borderRadius: `${theme.sama.radius.sm}px`,
    border: '1px solid rgba(15, 23, 42, 0.06)',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
  });
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Box sx={composedSx}>
      <Stack spacing={0.7} sx={{ width: 1, height: 1, justifyContent: 'space-between' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0.9,
            minWidth: 0,
          }}
        >
          {loading ? (
            <Skeleton height={22} variant="text" width="38%" />
          ) : (
            <Typography
              sx={(theme) => ({
                color: theme.sama.text.primary,
                fontSize: '0.84rem',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              })}
            >
              {label}
            </Typography>
          )}

          {loading ? (
            <Skeleton height={24} variant="rounded" width={72} />
          ) : change ? (
            <Box
              sx={(theme) => ({
                display: 'inline-flex',
                flexShrink: 0,
                alignItems: 'center',
                gap: 0.35,
                px: 0.68,
                py: 0.26,
                borderRadius: `${theme.sama.radius.pill}px`,
                backgroundColor: theme.sama.status[tone].surface,
                border: `1px solid ${theme.sama.status[tone].border}`,
                color: theme.sama.status[tone].fg,
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              })}
            >
              <StatusIcon sx={{ fontSize: '0.8rem' }} />
              <Box component="span">{change}</Box>
            </Box>
          ) : (
            <Box />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            minWidth: 0,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          {loading ? (
            <>
              <Skeleton height={38} variant="text" width="42%" />
              <Skeleton height={18} variant="text" width="24%" />
            </>
          ) : (
            <>
              <Typography
                component="div"
                sx={(theme) => ({
                  fontSize: { xs: '1.7rem', sm: '1.82rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: theme.sama.text.primary,
                  whiteSpace: { sm: 'nowrap' },
                  flexShrink: 0,
                })}
              >
                {value}
              </Typography>

              <Typography
                component="div"
                sx={(theme) => ({
                  color: theme.sama.text.muted,
                  fontSize: { xs: '0.8rem', sm: '0.82rem' },
                  fontWeight: 500,
                  lineHeight: 1.1,
                  whiteSpace: { sm: 'nowrap' },
                })}
              >
                {caption}
              </Typography>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
