import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ForecastOverviewResponse } from '@sama-energy/contracts';

import { formatCurrencyValue } from '@/lib/currency-format';

type RecentSummaryTableProps = {
  rows?: ForecastOverviewResponse['recentSummary'];
  currency: string;
  loading?: boolean;
};

type SummaryChangeTone = 'positive' | 'negative' | 'info';

function formatSummaryValue(value: number, unit: string) {
  if (unit.endsWith('/month')) {
    const currency = unit.replace('/month', '');

    return formatCurrencyValue(value, currency);
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

  return formatCurrencyValue(value, unit);
}

function formatChange(changePct: number) {
  const tone: SummaryChangeTone =
    changePct > 0 ? 'positive' : changePct < 0 ? 'negative' : 'info';
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
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  } as const;

  const rowGridTemplate = 'minmax(180px, 1.4fr) minmax(100px, 1fr) minmax(110px, 1fr) minmax(90px, 0.9fr)';
  const mobileValueLabelStyles = {
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
              sx={(theme) => ({
                borderRadius: `${theme.sama.radius.md}px`,
                border: `1px solid ${theme.sama.border.subtle}`,
                backgroundColor: theme.sama.surface.subtle,
                p: 1.5,
              })}
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
          sx={(theme) => ({
            display: { xs: 'none', sm: 'grid' },
            gridTemplateColumns: rowGridTemplate,
            gap: 2,
            alignItems: 'center',
            px: 1,
            py: 0.85,
            borderRadius: `${theme.sama.radius.sm}px`,
            backgroundColor: theme.sama.surface.subtle,
            borderBottom: `1px solid ${theme.sama.border.strong}`,
          })}
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
              sx={(theme) => ({
                borderRadius: `${theme.sama.radius.md}px`,
                border: `1px solid ${theme.sama.border.subtle}`,
                backgroundColor: theme.sama.surface.subtle,
                p: 1.5,
              })}
            >
              <Stack spacing={1.25}>
                <Box>
                  <Typography
                    sx={(theme) => ({
                      color: theme.sama.text.primary,
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    })}
                  >
                    {row.metric}
                  </Typography>
                  <Typography
                    sx={(theme) => ({
                      color: theme.sama.text.muted,
                      fontSize: '0.82rem',
                    })}
                  >
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
                    <Typography sx={(theme) => ({ ...mobileValueLabelStyles, color: theme.sama.text.muted })}>
                      Latest
                    </Typography>
                    <Typography sx={(theme) => ({ color: theme.sama.text.primary, fontWeight: 600 })}>
                      {formatSummaryValue(row.latest, row.unit === 'currency' ? currency : row.unit)}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.35}>
                    <Typography sx={(theme) => ({ ...mobileValueLabelStyles, color: theme.sama.text.muted })}>
                      Prior Period
                    </Typography>
                    <Typography sx={(theme) => ({ color: theme.sama.text.secondary, fontWeight: 600 })}>
                      {formatSummaryValue(row.prior, row.unit === 'currency' ? currency : row.unit)}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.35}>
                    <Typography sx={(theme) => ({ ...mobileValueLabelStyles, color: theme.sama.text.muted })}>
                      Change
                    </Typography>
                    <Typography sx={(theme) => ({ color: theme.sama.status[change.tone].fg, fontWeight: 700 })}>
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
        sx={(theme) => ({
          display: { xs: 'none', sm: 'grid' },
          gridTemplateColumns: rowGridTemplate,
          gap: 2,
          alignItems: 'center',
          px: 1,
          py: 0.85,
          borderRadius: `${theme.sama.radius.sm}px`,
          backgroundColor: theme.sama.surface.subtle,
          borderBottom: `1px solid ${theme.sama.border.strong}`,
        })}
      >
        <Typography sx={(theme) => ({ ...headerCellStyles, color: theme.sama.text.secondary })}>Metric</Typography>
        <Typography sx={(theme) => ({ ...headerCellStyles, color: theme.sama.text.secondary, textAlign: 'right' })}>Latest</Typography>
        <Typography sx={(theme) => ({ ...headerCellStyles, color: theme.sama.text.secondary, textAlign: 'right' })}>Prior Period</Typography>
        <Typography sx={(theme) => ({ ...headerCellStyles, color: theme.sama.text.secondary, textAlign: 'right' })}>Change</Typography>
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
              sx={(theme) => ({
                color: theme.sama.text.primary,
                fontSize: '0.95rem',
                fontWeight: 700,
              })}
            >
              {row.metric}
            </Typography>
            <Typography sx={(theme) => ({ color: theme.sama.text.primary, textAlign: 'right', fontWeight: 600 })}>
              {formatSummaryValue(row.latest, row.unit === 'currency' ? currency : row.unit)}
            </Typography>
            <Typography sx={(theme) => ({ color: theme.sama.text.secondary, textAlign: 'right', fontWeight: 600 })}>
              {formatSummaryValue(row.prior, row.unit === 'currency' ? currency : row.unit)}
            </Typography>
            <Typography
              sx={(theme) => ({
                color: theme.sama.status[change.tone].fg,
                textAlign: 'right',
                fontWeight: 700,
              })}
            >
              {change.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
