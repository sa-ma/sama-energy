import type {
  ComparisonRequest,
  ComparisonResponse,
  ComparisonRow,
  ComparisonSeries,
  MarketCode,
  SummaryMetricId,
} from '@sama-energy/contracts';

import { markets } from '../data/mock/markets.js';
import { AppError } from '../lib/errors.js';
import { getForecastOverview } from './forecast-service.js';

const COMPARISON_CURRENCY = 'GBP';
const FX_TO_GBP: Record<string, number> = {
  GBP: 1,
  USD: 0.79,
  EUR: 0.86,
};

const metricOrder: SummaryMetricId[] = [
  'avg-revenue',
  'volatility-index',
  'utilization',
  'spread-peak',
];

function roundToInteger(value: number) {
  return Math.round(value);
}

function roundToSingleDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function normalizeMonetaryValue(value: number, currency: string) {
  const fxRate = FX_TO_GBP[currency];

  if (!fxRate) {
    throw new Error(`Missing FX rate for ${currency}`);
  }

  return roundToInteger(value * fxRate);
}

function parseRequestedMarkets(input: string): MarketCode[] {
  const requestedMarkets = input
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (requestedMarkets.length < 2 || requestedMarkets.length > 3) {
    throw new AppError(
      400,
      'invalid_markets',
      'Select between 2 and 3 markets for comparison',
    );
  }

  const uniqueMarkets = new Set(requestedMarkets);

  if (uniqueMarkets.size !== requestedMarkets.length) {
    throw new AppError(400, 'invalid_markets', 'Duplicate markets are not allowed');
  }

  const validMarketCodes = new Set<string>(markets.map((market) => market.code));
  const invalidMarket = requestedMarkets.find(
    (market) => !validMarketCodes.has(market),
  );

  if (invalidMarket) {
    throw new AppError(
      400,
      'invalid_markets',
      `Unsupported market "${invalidMarket}"`,
    );
  }

  return requestedMarkets as MarketCode[];
}

function rankMarkets(values: Array<{ market: MarketCode; value: number }>) {
  const maxValue = Math.max(...values.map((entry) => entry.value));
  const minValue = Math.min(...values.map((entry) => entry.value));

  return {
    bestMarkets: values
      .filter((entry) => entry.value === maxValue)
      .map((entry) => entry.market),
    worstMarkets: values
      .filter((entry) => entry.value === minValue)
      .map((entry) => entry.market),
  };
}

export function getComparison(
  query: ComparisonRequest,
): ComparisonResponse {
  const selectedMarkets = query.markets.map((code) => {
    const market = markets.find((entry) => entry.code === code);

    if (!market) {
      throw new AppError(400, 'invalid_markets', `Unsupported market "${code}"`);
    }

    return market;
  });

  const overviews = selectedMarkets.map((market) => ({
    market,
    overview: getForecastOverview({
      market: market.code,
      durationHours: query.durationHours,
      dateRange: query.dateRange,
    }),
  }));

  const rows: ComparisonRow[] = metricOrder.map((metricId) => {
    const firstMetric = overviews[0].overview.summaryMetrics.find(
      (metric) => metric.id === metricId,
    );

    if (!firstMetric) {
      throw new Error(`Missing metric ${metricId}`);
    }

    const unit =
      metricId === 'avg-revenue'
        ? `${COMPARISON_CURRENCY}/month`
        : metricId === 'spread-peak'
          ? COMPARISON_CURRENCY
          : firstMetric.unit;

    return {
      metricId,
      label: firstMetric.label,
      unit,
      values: overviews.map(({ market, overview }) => {
        const metric = overview.summaryMetrics.find((entry) => entry.id === metricId);

        if (!metric) {
          throw new Error(`Missing metric ${metricId} for ${market.code}`);
        }

        if (metricId === 'avg-revenue' || metricId === 'spread-peak') {
          return normalizeMonetaryValue(metric.value, market.currency);
        }

        if (metricId === 'volatility-index') {
          return roundToSingleDecimal(metric.value);
        }

        return roundToInteger(metric.value);
      }),
    };
  });

  const chartSeries: ComparisonSeries[] = overviews.map(({ market, overview }) => ({
    market: market.code,
    label: market.name,
    unit: `${COMPARISON_CURRENCY}/month`,
    points: overview.trendData.map((point) => ({
      date: point.date,
      value: normalizeMonetaryValue(point.revenue, market.currency),
    })),
  }));

  const rankings = {
    'avg-revenue': rankMarkets(
      overviews.map(({ market }, index) => ({
        market: market.code,
        value: rows[0].values[index],
      })),
    ),
    'volatility-index': rankMarkets(
      overviews.map(({ market }, index) => ({
        market: market.code,
        value: rows[1].values[index],
      })),
    ),
    utilization: rankMarkets(
      overviews.map(({ market }, index) => ({
        market: market.code,
        value: rows[2].values[index],
      })),
    ),
    'spread-peak': rankMarkets(
      overviews.map(({ market }, index) => ({
        market: market.code,
        value: rows[3].values[index],
      })),
    ),
  };

  return {
    filters: {
      markets: query.markets,
      durationHours: query.durationHours,
      dateRange: query.dateRange,
      comparisonCurrency: COMPARISON_CURRENCY,
    },
    rows,
    chartSeries,
    rankings,
  };
}

export function parseComparisonQuery(input: {
  markets: string;
  durationHours: ComparisonRequest['durationHours'];
  dateRange: ComparisonRequest['dateRange'];
}): ComparisonRequest {
  return {
    markets: parseRequestedMarkets(input.markets),
    durationHours: input.durationHours,
    dateRange: input.dateRange,
  };
}
