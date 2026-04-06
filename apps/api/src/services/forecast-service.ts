import type {
  ForecastOverviewQuery,
  ForecastOverviewResponse,
} from '@sama-energy/contracts';

import { buildOverviewFixture, hasOverviewSeed } from '../data/mock/forecast.js';
import { markets } from '../data/mock/markets.js';
import { AppError } from '../lib/errors.js';

export function getForecastOverview(
  query: ForecastOverviewQuery,
): ForecastOverviewResponse {
  const market = markets.find((entry) => entry.code === query.market);

  if (!market) {
    throw new AppError(400, 'invalid_market', `Unsupported market "${query.market}"`);
  }

  if (!market.supportedDurations.includes(query.durationHours)) {
    throw new AppError(
      400,
      'unsupported_filters',
      `Duration ${query.durationHours}h is not supported for ${query.market}`,
    );
  }

  if (!hasOverviewSeed(query.market, query.durationHours)) {
    throw new AppError(
      400,
      'unsupported_filters',
      `No overview mock is configured for ${query.market} ${query.durationHours}h`,
    );
  }

  return buildOverviewFixture(
    query.market,
    query.durationHours,
    query.dateRange,
    market.currency,
  );
}
