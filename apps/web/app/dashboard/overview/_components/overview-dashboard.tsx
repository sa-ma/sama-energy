'use client';

import { useEffect, useMemo, useTransition } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import type {
  ForecastOverviewResponse,
  Market,
  MarketCode,
  SummaryMetricId,
} from '@sama-energy/contracts';
import {
  parseAsNumberLiteral,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import {
  getForecastOverview,
  getMarkets,
} from '@/lib/api-client';
import { dashboardQueryKeys } from '@/lib/query-keys';

import ForecastChart from './forecast-chart';
import MetricCard from './metric-card';
import OverviewFilterBar from './overview-filter-bar';
import OverviewHeader from './overview-header';
import SectionPanel from './section-panel';
import TrendChart from './trend-chart';

const marketCodes = ['GB', 'ERCOT'] as const;
const durationHoursValues = [1, 2, 4] as const;
const dateRangeValues = ['3M', '6M', '12M'] as const;
const summaryBorderColor = 'rgba(203, 213, 225, 0.98)';

const fallbackMarkets: Market[] = [
  {
    code: 'GB',
    name: 'Great Britain',
    currency: 'GBP',
    timezone: 'Europe/London',
    supportedDurations: [1, 2, 4],
  },
  {
    code: 'ERCOT',
    name: 'ERCOT',
    currency: 'USD',
    timezone: 'America/Chicago',
    supportedDurations: [1, 2],
  },
];

const metricCaptions: Record<SummaryMetricId, string> = {
  'avg-revenue': 'Monthly benchmark',
  'volatility-index': 'Price dispersion signal',
  utilization: 'Fleet dispatch intensity',
  'spread-peak': 'Observed market high',
};

const metricOrder: SummaryMetricId[] = [
  'avg-revenue',
  'volatility-index',
  'utilization',
  'spread-peak',
];

const filterParsers = {
  market: parseAsStringLiteral(marketCodes).withDefault('GB'),
  durationHours: parseAsNumberLiteral(durationHoursValues).withDefault(2),
  dateRange: parseAsStringLiteral(dateRangeValues).withDefault('12M'),
};

function formatMetricValue(metric: ForecastOverviewResponse['summaryMetrics'][number]) {
  if (metric.unit.endsWith('/month')) {
    const currency = metric.unit.replace('/month', '');

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(metric.value);
  }

  if (metric.unit === '%') {
    return `${Math.round(metric.value)}%`;
  }

  if (metric.unit === 'index') {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(metric.value);
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: metric.unit,
    maximumFractionDigits: 0,
  }).format(metric.value);
}

function formatChangePct(changePct: number) {
  return `${Math.abs(changePct).toFixed(1)}%`;
}

function ChartSkeleton() {
  return (
    <Stack spacing={2} sx={{ height: 1 }}>
      <Skeleton variant="rounded" height={32} width="38%" />
      <Skeleton variant="rounded" sx={{ flex: 1, minHeight: 240 }} />
    </Stack>
  );
}

export default function OverviewDashboard() {
  const [isFilterTransitionPending, startFilterTransition] = useTransition();
  const [filters, setFilters] = useQueryStates(filterParsers, {
    history: 'replace',
  });

  const marketsQuery = useQuery({
    queryKey: dashboardQueryKeys.markets,
    queryFn: getMarkets,
    placeholderData: { markets: fallbackMarkets },
    staleTime: 5 * 60 * 1000,
  });

  const markets = marketsQuery.data?.markets ?? fallbackMarkets;
  const selectedMarket =
    markets.find((market) => market.code === filters.market) ?? fallbackMarkets[0];
  const supportedDurations = selectedMarket.supportedDurations;
  const effectiveDuration = supportedDurations.includes(filters.durationHours)
    ? filters.durationHours
    : supportedDurations[0];

  useEffect(() => {
    if (filters.durationHours !== effectiveDuration) {
      startFilterTransition(() => {
        void setFilters({ durationHours: effectiveDuration });
      });
    }
  }, [effectiveDuration, filters.durationHours, setFilters]);

  const overviewQuery = useQuery({
    queryKey: dashboardQueryKeys.overview({
      market: selectedMarket.code,
      durationHours: effectiveDuration,
      dateRange: filters.dateRange,
    }),
    queryFn: () =>
      getForecastOverview({
        market: selectedMarket.code,
        durationHours: effectiveDuration,
        dateRange: filters.dateRange,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const metricsById = useMemo(
    () =>
      new Map(
        (overviewQuery.data?.summaryMetrics ?? []).map((metric) => [
          metric.id,
          metric,
        ]),
      ),
    [overviewQuery.data?.summaryMetrics],
  );

  const isInitialLoading = overviewQuery.isPending && !overviewQuery.data;
  const isUpdating =
    isFilterTransitionPending || (overviewQuery.isFetching && !!overviewQuery.data);
  const hasInitialError = overviewQuery.isError && !overviewQuery.data;
  const hasRefetchError = overviewQuery.isError && !!overviewQuery.data;
  const helperMessage = marketsQuery.isError
    ? 'Market metadata could not be refreshed. Showing fallback filter options.'
    : hasRefetchError
      ? 'Latest data refresh failed. Showing the previous successful response.'
      : undefined;

  const handleFilterUpdate = (nextFilters: Partial<typeof filters>) => {
    startFilterTransition(() => {
      void setFilters(nextFilters);
    });
  };

  const handleMarketChange = (marketCode: MarketCode) => {
    const nextMarket =
      markets.find((market) => market.code === marketCode) ??
      fallbackMarkets[0];
    const nextDuration = nextMarket.supportedDurations.includes(effectiveDuration)
      ? effectiveDuration
      : nextMarket.supportedDurations[0];

    handleFilterUpdate({
      market: nextMarket.code,
      durationHours: nextDuration,
    });
  };

  const handleRetry = () => {
    void marketsQuery.refetch();
    void overviewQuery.refetch();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <OverviewHeader
        subtitle="Explore battery market performance, trends, and forecast signals"
      />

      <OverviewFilterBar
        dateRange={filters.dateRange}
        dateRangeOptions={dateRangeValues.map((value) => ({
          value,
          label: `Last ${value.slice(0, -1)} months`,
        }))}
        durationHours={effectiveDuration}
        durationOptions={supportedDurations.map((value) => ({
          value,
          label: `${value} ${value === 1 ? 'hour' : 'hours'}`,
        }))}
        helperMessage={helperMessage}
        isUpdating={isUpdating}
        market={selectedMarket.code}
        marketOptions={markets.map((market) => ({
          value: market.code,
          label: market.name,
        }))}
        onDateRangeChange={(dateRange) => handleFilterUpdate({ dateRange })}
        onDurationChange={(durationHours) => handleFilterUpdate({ durationHours })}
        onMarketChange={handleMarketChange}
      />

      {hasInitialError ? (
        <SectionPanel
          title="Overview unavailable"
          subtitle="The current market selection could not be loaded."
          minHeight={240}
        >
          <Stack spacing={2} justifyContent="center" sx={{ height: 1 }}>
            <Alert
              action={
                <Button color="inherit" onClick={handleRetry} size="small">
                  Retry
                </Button>
              }
              severity="error"
              variant="outlined"
            >
              The dashboard data could not be loaded. Check the API and try again.
            </Alert>
            <Typography color="text.secondary" variant="body2">
              Current filters: {selectedMarket.name}, {effectiveDuration}h,{' '}
              {filters.dateRange}
            </Typography>
          </Stack>
        </SectionPanel>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              overflow: 'hidden',
              borderRadius: 3,
              border: '1px solid',
              borderColor: summaryBorderColor,
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                xl: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            {metricOrder.map((metricId) => {
              const metric = metricsById.get(metricId);
              const metricIndex = metricOrder.indexOf(metricId);

              return (
                <MetricCard
                  key={metricId}
                  caption={metricCaptions[metricId]}
                  change={metric ? formatChangePct(metric.changePct) : undefined}
                  label={metric?.label ?? 'Loading'}
                  loading={isInitialLoading}
                  sx={{
                    borderRight: {
                      xs: 'none',
                      sm:
                        metricIndex % 2 === 0
                          ? `1px solid ${summaryBorderColor}`
                          : 'none',
                      xl:
                        metricIndex < metricOrder.length - 1
                          ? `1px solid ${summaryBorderColor}`
                          : 'none',
                    },
                    borderBottom: {
                      xs:
                        metricIndex < metricOrder.length - 1
                          ? `1px solid ${summaryBorderColor}`
                          : 'none',
                      sm:
                        metricIndex < 2 ? `1px solid ${summaryBorderColor}` : 'none',
                      xl: 'none',
                    },
                  }}
                  tone={metric && metric.changePct < 0 ? 'negative' : 'positive'}
                  value={metric ? formatMetricValue(metric) : undefined}
                />
              );
            })}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'minmax(0, 1.7fr) minmax(320px, 1fr)',
              },
              alignItems: 'stretch',
            }}
          >
            <SectionPanel
              title="Revenue & Price Trends"
              subtitle="Historical market performance over the selected period"
              minHeight={360}
            >
              {isInitialLoading ? (
                <ChartSkeleton />
              ) : overviewQuery.data ? (
                <TrendChart
                  currency={selectedMarket.currency}
                  data={overviewQuery.data.trendData}
                />
              ) : null}
            </SectionPanel>

            <SectionPanel
              title="Forecast Preview"
              subtitle="Base, low, and high case outlook"
              minHeight={360}
            >
              {isInitialLoading ? (
                <ChartSkeleton />
              ) : overviewQuery.data ? (
                <ForecastChart
                  currency={selectedMarket.currency}
                  data={overviewQuery.data.forecastPreview}
                />
              ) : null}
            </SectionPanel>
          </Box>
        </>
      )}
    </Box>
  );
}
