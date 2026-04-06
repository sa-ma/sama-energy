import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

const sharedBorderColor = 'rgba(203, 213, 225, 0.98)';

type MetricCardProps = {
  label: string;
  value?: string;
  caption: string;
  change?: string;
  loading?: boolean;
  tone?: 'positive' | 'negative';
  sx?: SxProps<Theme>;
};

export default function MetricCard({
  label,
  value,
  caption,
  change,
  loading = false,
  tone = 'positive',
  sx,
}: MetricCardProps) {
  const StatusIcon =
    tone === 'negative' ? ArrowDownwardRounded : ArrowUpwardRounded;

  return (
    <Box
      sx={{
        minWidth: 0,
        px: { xs: 2.5, sm: 3 },
        py: { xs: 2.5, sm: 3 },
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: sharedBorderColor,
        ...sx,
      }}
    >
      <Stack spacing={1.1}>
        <Typography
          sx={{
            color: '#0f172a',
            fontSize: '0.98rem',
            fontWeight: 650,
          }}
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
              sx={{
                fontSize: { xs: '2.05rem', sm: '2.2rem' },
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1.05,
                color: '#0f172a',
              }}
            >
              {value}
            </Typography>
          )}

          {loading ? (
            <Skeleton height={32} variant="rounded" width={82} />
          ) : change ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.2,
                py: 0.6,
                borderRadius: 999,
                backgroundColor:
                  tone === 'negative'
                    ? 'rgba(254, 242, 242, 0.86)'
                    : 'rgba(240, 253, 244, 0.9)',
                color: tone === 'negative' ? '#b45309' : '#2f855a',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <StatusIcon sx={{ fontSize: '0.95rem' }} />
              <Box component="span">{change}</Box>
            </Box>
          ) : null}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#4b5563',
            fontSize: '0.92rem',
          }}
        >
          {caption}
        </Typography>
      </Stack>
    </Box>
  );
}
