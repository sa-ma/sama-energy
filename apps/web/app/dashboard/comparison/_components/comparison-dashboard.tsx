'use client';

import { useEffect, useMemo, useTransition } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  DashboardPageHeader,
  SectionPanel,
} from '@sama-energy/ui';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import type {
  DateRange,
  DurationHours,
  Market,
  MarketCode,
} from '@sama-energy/contracts';
import {
  createParser,
  parseAsNumberLiteral,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import {
  getComparison,
  getMarkets,
} from '@/lib/api-client';
import {
  dateRangeValues,
  defaultComparisonMarkets,
  durationHoursValues,
  fallbackMarkets,
  marketCodes,
} from '@/lib/dashboard-filters';
import { dashboardQueryKeys } from '@/lib/query-keys';

import ComparisonFilterBar from './comparison-filter-bar';
import ComparisonKpiTable from './comparison-kpi-table';
import ComparisonLoadingShell from './comparison-loading-shell';
import ComparisonRankingSummary from './comparison-ranking-summary';
import ComparisonTrendChart from './comparison-trend-chart';

function areSameMarkets(a: MarketCode[], b: MarketCode[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

const marketsParser = createParser<MarketCode[]>({
  parse(value) {
    const parsed = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (parsed.length < 2 || parsed.length > 3) {
      return null;
    }

    if (new Set(parsed).size !== parsed.length) {
      return null;
    }

    if (parsed.some((item) => !marketCodes.includes(item as MarketCode))) {
      return null;
    }

    return parsed as MarketCode[];
  },
  serialize(value) {
    return value.join(',');
  },
  eq: areSameMarkets,
}).withDefault(defaultComparisonMarkets);

const filterParsers = {
  markets: marketsParser,
  durationHours: parseAsNumberLiteral(durationHoursValues).withDefault(2),
  dateRange: parseAsStringLiteral(dateRangeValues).withDefault('12M'),
};

export default function ComparisonDashboard() {
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

  const availableMarkets = marketsQuery.data?.markets ?? fallbackMarkets;
  const availableMarketMap = useMemo(
    () => new Map(availableMarkets.map((market) => [market.code, market])),
    [availableMarkets],
  );

  const effectiveMarkets = filters.markets.filter((marketCode) =>
    availableMarketMap.has(marketCode),
  );
  const selectedMarketCodes =
    effectiveMarkets.length >= 2 ? effectiveMarkets : defaultComparisonMarkets;
  const selectedMarkets = selectedMarketCodes
    .map((marketCode) => availableMarketMap.get(marketCode))
    .filter((market): market is Market => Boolean(market));

  const supportedDurations = selectedMarkets.reduce<DurationHours[]>(
    (intersection, market, index) => {
      if (index === 0) {
        return [...market.supportedDurations];
      }

      return intersection.filter((duration) =>
        market.supportedDurations.includes(duration),
      );
    },
    [],
  );

  const effectiveDuration = supportedDurations.includes(filters.durationHours)
    ? filters.durationHours
    : supportedDurations[0];

  useEffect(() => {
    if (!areSameMarkets(filters.markets, selectedMarketCodes)) {
      startFilterTransition(() => {
        void setFilters({ markets: selectedMarketCodes });
      });
    }
  }, [filters.markets, selectedMarketCodes, setFilters]);

  useEffect(() => {
    if (filters.durationHours !== effectiveDuration) {
      startFilterTransition(() => {
        void setFilters({ durationHours: effectiveDuration });
      });
    }
  }, [effectiveDuration, filters.durationHours, setFilters]);

  const comparisonQuery = useQuery({
    queryKey: dashboardQueryKeys.comparison({
      markets: selectedMarketCodes,
      durationHours: effectiveDuration,
      dateRange: filters.dateRange,
    }),
    queryFn: () =>
      getComparison({
        markets: selectedMarketCodes,
        durationHours: effectiveDuration,
        dateRange: filters.dateRange,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const isInitialLoading = comparisonQuery.isPending && !comparisonQuery.data;
  const isUpdating =
    isFilterTransitionPending || (comparisonQuery.isFetching && !!comparisonQuery.data);
  const hasInitialError = comparisonQuery.isError && !comparisonQuery.data;
  const hasRefetchError = comparisonQuery.isError && !!comparisonQuery.data;
  const helperMessage = marketsQuery.isError
    ? 'Market metadata could not be refreshed. Showing fallback filter options.'
    : hasRefetchError
      ? 'Latest comparison refresh failed. Showing the previous successful response.'
      : undefined;

  const handleFilterUpdate = (
    nextFilters: Partial<{
      markets: MarketCode[];
      durationHours: DurationHours;
      dateRange: DateRange;
    }>,
  ) => {
    startFilterTransition(() => {
      void setFilters(nextFilters);
    });
  };

  const handleRetry = () => {
    void marketsQuery.refetch();
    void comparisonQuery.refetch();
  };

  const displayedMarketCodes = comparisonQuery.data?.filters.markets ?? selectedMarketCodes;
  const displayedMarkets = displayedMarketCodes
    .map((marketCode) => availableMarketMap.get(marketCode))
    .filter((market): market is Market => Boolean(market));

  if (isInitialLoading) {
    return <ComparisonLoadingShell />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <DashboardPageHeader
        title="Market Comparison"
        subtitle="Compare battery market performance across selected regions"
      />

      <ComparisonFilterBar
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
        marketOptions={availableMarkets.map((market) => ({
          value: market.code,
          label: market.name,
        }))}
        markets={selectedMarketCodes}
        onDateRangeChange={(dateRange) => handleFilterUpdate({ dateRange })}
        onDurationChange={(durationHours) => handleFilterUpdate({ durationHours })}
        onMarketsChange={(markets) => handleFilterUpdate({ markets })}
      />

      {hasInitialError ? (
        <SectionPanel
          variant="outlined"
          title="Comparison unavailable"
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
              The comparison data could not be loaded. Check the API and try again.
            </Alert>
            <Typography color="text.secondary" variant="body2">
              Current filters: {selectedMarketCodes.join(', ')}, {effectiveDuration}h, {filters.dateRange}
            </Typography>
          </Stack>
        </SectionPanel>
      ) : (
        <>
          <SectionPanel
            title="KPI Comparison"
            subtitle="Core market indicators aligned to the same duration and time range"
            minHeight={0}
            bleedContentX
          >
            {comparisonQuery.data ? (
              <ComparisonKpiTable
                markets={displayedMarkets}
                rankings={comparisonQuery.data.rankings}
                rows={comparisonQuery.data.rows}
              />
            ) : null}
          </SectionPanel>

          <SectionPanel
            title="Revenue Trend"
            subtitle="Normalized revenue performance over time"
            minHeight={320}
          >
            {comparisonQuery.data ? (
              <ComparisonTrendChart
                currency={comparisonQuery.data.filters.comparisonCurrency}
                markets={displayedMarkets}
                series={comparisonQuery.data.chartSeries}
              />
            ) : null}
          </SectionPanel>

          <SectionPanel
            title="Comparison Summary"
            subtitle="Highest and lowest market for each comparison metric"
            minHeight={0}
          >
            {comparisonQuery.data ? (
              <ComparisonRankingSummary
                markets={displayedMarkets}
                rankings={comparisonQuery.data.rankings}
              />
            ) : null}
          </SectionPanel>
        </>
      )}
    </Box>
  );
}
