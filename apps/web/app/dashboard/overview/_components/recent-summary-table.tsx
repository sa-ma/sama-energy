import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ForecastOverviewResponse } from '@sama-energy/contracts';

type RecentSummaryTableProps = {
  rows?: ForecastOverviewResponse['recentSummary'];
  currency: string;
  loading?: boolean;
};

function formatSummaryValue(value: number, unit: string) {
  if (unit.endsWith('/month')) {
    const currency = unit.replace('/month', '');

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (unit === '%') {
    return `${Math.round(value)}%`;
  }

  if (unit === 'index') {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: unit,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatChange(changePct: number) {
  const tone =
    changePct > 0 ? '#15803d' : changePct < 0 ? '#b91c1c' : '#475569';
  const sign = changePct > 0 ? '+' : changePct < 0 ? '' : '';

  return {
    label: `${sign}${changePct.toFixed(1)}%`,
    tone,
  };
}

export default function RecentSummaryTable({
  rows,
  currency,
  loading = false,
}: RecentSummaryTableProps) {
  const headerCellStyles = {
    color: '#334155',
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  } as const;

  const rowGridTemplate = 'minmax(180px, 1.4fr) minmax(100px, 1fr) minmax(110px, 1fr) minmax(90px, 0.9fr)';
  const mobileValueLabelStyles = {
    color: '#64748b',
    fontSize: '0.76rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  } as const;

  if (loading) {
    return (
      <Stack spacing={0}>
        <Stack spacing={1.25} sx={{ display: { xs: 'flex', sm: 'none' } }}>
          {Array.from({ length: 4 }, (_, index) => (
            <Box
              key={`summary-mobile-row-${index + 1}`}
              sx={{
                borderRadius: 2.5,
                border: '1px solid rgba(226, 232, 240, 0.95)',
                backgroundColor: 'rgba(248, 250, 252, 0.7)',
                p: 1.5,
              }}
            >
              <Stack spacing={1.25}>
                <Skeleton height={20} width="52%" />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1.25,
                  }}
                >
                  {Array.from({ length: 3 }, (_, valueIndex) => (
                    <Stack key={`summary-mobile-cell-${index + 1}-${valueIndex + 1}`} spacing={0.5}>
                      <Skeleton height={12} width="52%" />
                      <Skeleton height={18} width="74%" />
                    </Stack>
                  ))}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            display: { xs: 'none', sm: 'grid' },
            gridTemplateColumns: rowGridTemplate,
            gap: 2,
            alignItems: 'center',
            px: 1,
            py: 0.85,
            borderRadius: 2,
            backgroundColor: 'rgba(248, 250, 252, 0.95)',
            borderBottom: '1px solid rgba(203, 213, 225, 0.98)',
          }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={`summary-head-${index + 1}`} height={16} width="70%" />
          ))}
        </Box>
        {Array.from({ length: 4 }, (_, index) => (
          <Box
            key={`summary-row-${index + 1}`}
            sx={{
              display: { xs: 'none', sm: 'grid' },
              gridTemplateColumns: rowGridTemplate,
              gap: 2,
              alignItems: 'center',
              py: 0.95,
            }}
          >
            <Skeleton height={18} width="72%" />
            <Skeleton height={18} width="68%" />
            <Skeleton height={18} width="68%" />
            <Skeleton height={18} width="54%" />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={0}>
      <Stack spacing={1.25} sx={{ display: { xs: 'flex', sm: 'none' } }}>
        {rows?.map((row) => {
          const change = formatChange(row.changePct);

          return (
            <Box
              key={`${row.metric}-mobile`}
              sx={{
                borderRadius: 2.5,
                border: '1px solid rgba(226, 232, 240, 0.95)',
                backgroundColor: 'rgba(248, 250, 252, 0.72)',
                p: 1.5,
              }}
            >
              <Stack spacing={1.25}>
                <Box>
                  <Typography
                    sx={{
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}
                  >
                    {row.metric}
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                    {row.unit}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1.25,
                  }}
                >
                  <Stack spacing={0.35}>
                    <Typography sx={mobileValueLabelStyles}>Latest</Typography>
                    <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>
                      {formatSummaryValue(row.latest, row.unit === 'currency' ? currency : row.unit)}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.35}>
                    <Typography sx={mobileValueLabelStyles}>Prior Period</Typography>
                    <Typography sx={{ color: '#334155', fontWeight: 600 }}>
                      {formatSummaryValue(row.prior, row.unit === 'currency' ? currency : row.unit)}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.35}>
                    <Typography sx={mobileValueLabelStyles}>Change</Typography>
                    <Typography sx={{ color: change.tone, fontWeight: 700 }}>
                      {change.label}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <Box
        sx={{
          display: { xs: 'none', sm: 'grid' },
          gridTemplateColumns: rowGridTemplate,
          gap: 2,
          alignItems: 'center',
          px: 1,
          py: 0.85,
          borderRadius: 2,
          backgroundColor: 'rgba(248, 250, 252, 0.95)',
          borderBottom: '1px solid rgba(203, 213, 225, 0.98)',
        }}
      >
        <Typography sx={headerCellStyles}>Metric</Typography>
        <Typography sx={{ ...headerCellStyles, textAlign: 'right' }}>Latest</Typography>
        <Typography sx={{ ...headerCellStyles, textAlign: 'right' }}>Prior Period</Typography>
        <Typography sx={{ ...headerCellStyles, textAlign: 'right' }}>Change</Typography>
      </Box>

      {rows?.map((row) => {
        const change = formatChange(row.changePct);

        return (
          <Box
            key={row.metric}
            sx={{
              display: { xs: 'none', sm: 'grid' },
              gridTemplateColumns: rowGridTemplate,
              gap: 2,
              alignItems: 'center',
              py: 0.95,
            }}
          >
            <Typography
              sx={{
                color: '#0f172a',
                fontSize: '0.95rem',
                fontWeight: 700,
              }}
            >
              {row.metric}
            </Typography>
            <Typography sx={{ color: '#0f172a', textAlign: 'right', fontWeight: 600 }}>
              {formatSummaryValue(row.latest, row.unit === 'currency' ? currency : row.unit)}
            </Typography>
            <Typography sx={{ color: '#334155', textAlign: 'right', fontWeight: 600 }}>
              {formatSummaryValue(row.prior, row.unit === 'currency' ? currency : row.unit)}
            </Typography>
            <Typography sx={{ color: change.tone, textAlign: 'right', fontWeight: 700 }}>
              {change.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
