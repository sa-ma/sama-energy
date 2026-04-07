import { describe, expect, it } from 'vitest';

import {
  defaultComparisonMarkets,
  getEffectiveComparisonFilters,
  getEffectiveOverviewFilters,
  parseComparisonSearchParams,
  parseOverviewSearchParams,
} from './dashboard-filters';

describe('dashboard filters', () => {
  it('defaults invalid overview params to the canonical overview filters', () => {
    expect(
      parseOverviewSearchParams({
        market: 'FR',
        durationHours: '3',
        dateRange: '1Y',
      }),
    ).toEqual({
      market: 'GB',
      durationHours: 2,
      dateRange: '12M',
    });
  });

  it('rejects invalid comparison market sets and falls back to the default pair', () => {
    expect(
      parseComparisonSearchParams({
        markets: 'GB,GB,FR',
        durationHours: '2',
        dateRange: '6M',
      }),
    ).toEqual({
      markets: defaultComparisonMarkets,
      durationHours: 2,
      dateRange: '6M',
    });
  });

  it('coerces unsupported overview durations to the first supported option', () => {
    expect(
      getEffectiveOverviewFilters({
        market: 'ERCOT',
        durationHours: 4,
        dateRange: '6M',
      }),
    ).toEqual({
      market: 'ERCOT',
      durationHours: 1,
      dateRange: '6M',
    });
  });

  it('coerces comparison duration to the first shared duration', () => {
    expect(
      getEffectiveComparisonFilters({
        markets: ['GB', 'ERCOT', 'DE'],
        durationHours: 4,
        dateRange: '12M',
      }),
    ).toEqual({
      markets: ['GB', 'ERCOT', 'DE'],
      durationHours: 1,
      dateRange: '12M',
    });
  });

  it('drops unavailable markets and recovers to a valid default selection', () => {
    expect(
      getEffectiveComparisonFilters(
        {
          markets: ['GB', 'DE'],
          durationHours: 4,
          dateRange: '3M',
        },
        [
          {
            code: 'GB',
            currency: 'GBP',
            name: 'Great Britain',
            supportedDurations: [1, 2, 4],
            timezone: 'Europe/London',
          },
          {
            code: 'ERCOT',
            currency: 'USD',
            name: 'ERCOT',
            supportedDurations: [1, 2],
            timezone: 'America/Chicago',
          },
        ],
      ),
    ).toEqual({
      markets: defaultComparisonMarkets,
      durationHours: 1,
      dateRange: '3M',
    });
  });
});
