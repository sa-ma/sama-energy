import type { ForecastOverviewQuery } from '@sama-energy/contracts';

export const dashboardQueryKeys = {
  markets: ['markets'] as const,
  overview: (filters: ForecastOverviewQuery) =>
    ['forecast-overview', filters] as const,
};
