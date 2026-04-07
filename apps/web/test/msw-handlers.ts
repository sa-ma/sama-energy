import type {
  ComparisonRequest,
  DateRange,
  DurationHours,
  ForecastOverviewQuery,
  MarketCode,
} from '@sama-energy/contracts';
import {
  HttpResponse,
  http,
} from 'msw';

import {
  buildComparisonResponse,
  buildMarketsResponse,
  buildOverviewResponse,
} from './fixtures/dashboard-data';

function parseDurationHours(value: string | null): DurationHours {
  return Number(value) as DurationHours;
}

function parseOverviewQuery(request: Request): ForecastOverviewQuery {
  const url = new URL(request.url);

  return {
    market: (url.searchParams.get('market') ?? 'GB') as MarketCode,
    durationHours: parseDurationHours(url.searchParams.get('durationHours')),
    dateRange: (url.searchParams.get('dateRange') ?? '12M') as DateRange,
  };
}

function parseComparisonQuery(request: Request): ComparisonRequest {
  const url = new URL(request.url);
  const serializedMarkets = url.searchParams.get('markets') ?? '';

  return {
    markets: serializedMarkets.split(',').filter(Boolean) as MarketCode[],
    durationHours: parseDurationHours(url.searchParams.get('durationHours')),
    dateRange: (url.searchParams.get('dateRange') ?? '12M') as DateRange,
  };
}

export function createDefaultHandlers() {
  return [
    http.get(/\/markets$/, () => HttpResponse.json(buildMarketsResponse())),
    http.get(/\/forecast\/overview$/, ({ request }) =>
      HttpResponse.json(buildOverviewResponse(parseOverviewQuery(request))),
    ),
    http.get(/\/comparison$/, ({ request }) =>
      HttpResponse.json(buildComparisonResponse(parseComparisonQuery(request))),
    ),
  ];
}
