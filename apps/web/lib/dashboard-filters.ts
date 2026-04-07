import type {
  ComparisonRequest,
  DateRange,
  DurationHours,
  ForecastOverviewQuery,
  Market,
  MarketCode,
} from '@sama-energy/contracts';

export const marketCodes = ['GB', 'ERCOT', 'DE'] as const;
export const durationHoursValues = [1, 2, 4] as const;
export const dateRangeValues = ['3M', '6M', '12M'] as const;
export const defaultComparisonMarkets: MarketCode[] = ['GB', 'ERCOT'];

export const fallbackMarkets: Market[] = [
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
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    supportedDurations: [1, 2, 4],
  },
];

type SearchParams = Record<string, string | string[] | undefined>;

function getFirstSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isMarketCode(value: string): value is MarketCode {
  return marketCodes.includes(value as MarketCode);
}

function isDurationHours(value: number): value is DurationHours {
  return durationHoursValues.includes(value as DurationHours);
}

function isDateRange(value: string): value is DateRange {
  return dateRangeValues.includes(value as DateRange);
}

export function parseOverviewSearchParams(searchParams: SearchParams): ForecastOverviewQuery {
  const marketValue = getFirstSearchParamValue(searchParams.market);
  const durationValue = Number(getFirstSearchParamValue(searchParams.durationHours));
  const dateRangeValue = getFirstSearchParamValue(searchParams.dateRange);

  return {
    market: marketValue && isMarketCode(marketValue) ? marketValue : 'GB',
    durationHours: isDurationHours(durationValue) ? durationValue : 2,
    dateRange: dateRangeValue && isDateRange(dateRangeValue) ? dateRangeValue : '12M',
  };
}

export function parseComparisonSearchParams(searchParams: SearchParams): ComparisonRequest {
  const serializedMarkets = getFirstSearchParamValue(searchParams.markets);
  const parsedMarkets = serializedMarkets
    ?.split(',')
    .map((value) => value.trim())
    .filter((value): value is MarketCode => isMarketCode(value));
  const uniqueMarkets = parsedMarkets ? Array.from(new Set(parsedMarkets)) : [];
  const durationValue = Number(getFirstSearchParamValue(searchParams.durationHours));
  const dateRangeValue = getFirstSearchParamValue(searchParams.dateRange);

  return {
    markets:
      uniqueMarkets.length >= 2 && uniqueMarkets.length <= 3
        ? uniqueMarkets
        : defaultComparisonMarkets,
    durationHours: isDurationHours(durationValue) ? durationValue : 2,
    dateRange: dateRangeValue && isDateRange(dateRangeValue) ? dateRangeValue : '12M',
  };
}

export function getEffectiveOverviewFilters(
  filters: ForecastOverviewQuery,
  markets: Market[] = fallbackMarkets,
): ForecastOverviewQuery {
  const selectedMarket =
    markets.find((market) => market.code === filters.market) ?? fallbackMarkets[0];
  const durationHours = selectedMarket.supportedDurations.includes(filters.durationHours)
    ? filters.durationHours
    : selectedMarket.supportedDurations[0];

  return {
    market: selectedMarket.code,
    durationHours,
    dateRange: filters.dateRange,
  };
}

export function getEffectiveComparisonFilters(
  filters: ComparisonRequest,
  markets: Market[] = fallbackMarkets,
): ComparisonRequest {
  const availableMarketMap = new Map(markets.map((market) => [market.code, market]));
  const effectiveMarkets = filters.markets.filter((marketCode) =>
    availableMarketMap.has(marketCode),
  );
  const normalizedMarkets =
    effectiveMarkets.length >= 2 ? effectiveMarkets : defaultComparisonMarkets;
  const selectedMarkets = normalizedMarkets
    .map((marketCode) => availableMarketMap.get(marketCode))
    .filter((market): market is Market => Boolean(market));
  const supportedDurations = selectedMarkets.reduce<DurationHours[]>(
    (intersection, market, index) => {
      if (index === 0) {
        return [...market.supportedDurations];
      }

      return intersection.filter((duration) => market.supportedDurations.includes(duration));
    },
    [],
  );
  const durationHours = supportedDurations.includes(filters.durationHours)
    ? filters.durationHours
    : supportedDurations[0];

  return {
    markets: normalizedMarkets,
    durationHours,
    dateRange: filters.dateRange,
  };
}
