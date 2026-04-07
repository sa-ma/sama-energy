import type {
  ComparisonRequest,
  ForecastOverviewQuery,
  MarketsResponse,
} from '@sama-energy/contracts';

import { buildOverviewFixture } from '../../../api/src/data/mock/forecast';
import { markets } from '../../../api/src/data/mock/markets';
import { getComparison } from '../../../api/src/services/comparison-service';

function cloneMarkets() {
  return markets.map((market) => ({
    ...market,
    supportedDurations: [...market.supportedDurations],
  }));
}

export function buildMarketsResponse(): MarketsResponse {
  return {
    markets: cloneMarkets(),
  };
}

export function buildOverviewResponse(query: ForecastOverviewQuery) {
  const market = markets.find((entry) => entry.code === query.market);

  if (!market) {
    throw new Error(`Unknown market "${query.market}"`);
  }

  return buildOverviewFixture(
    query.market,
    query.durationHours,
    query.dateRange,
    market.currency,
  );
}

export function buildComparisonResponse(query: ComparisonRequest) {
  return getComparison(query);
}
