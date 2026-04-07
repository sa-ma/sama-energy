import type {
  ComparisonRequest,
  ForecastOverviewQuery,
} from '@sama-energy/contracts';

export const dashboardQueryKeys = {
  markets: ['markets'] as const,
  comparison: (filters: ComparisonRequest) =>
    ['market-comparison', filters] as const,
  overview: (filters: ForecastOverviewQuery) =>
    ['forecast-overview', filters] as const,
};
